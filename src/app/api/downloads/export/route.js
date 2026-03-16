import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/app/lib/session";

// GET /api/downloads/export — تصدير التحميلات كـ CSV
export async function GET(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const occasionId = searchParams.get("occasionId");

    const where = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from + "T00:00:00");
      if (to) where.createdAt.lte = new Date(to + "T23:59:59");
    }
    if (occasionId) {
      where.template = { occasionId };
    }

    const downloads = await prisma.download.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userName: true,
        deptName: true,
        device: true,
        browser: true,
        os: true,
        createdAt: true,
        template: {
          select: {
            id: true,
            occasion: { select: { name: true } },
          },
        },
      },
    });

    // بناء CSV
    const BOM = "\uFEFF"; // لدعم العربية في Excel
    const headers = [
      "الاسم",
      "الإدارة",
      "المناسبة",
      "الجهاز",
      "المتصفح",
      "نظام التشغيل",
      "التاريخ",
    ];

    const rows = downloads.map((d) => [
      d.userName || "",
      d.deptName || "",
      d.template?.occasion?.name || "",
      d.device || "",
      d.browser || "",
      d.os || "",
      new Date(d.createdAt).toLocaleString("ar-SA"),
    ]);

    const csvContent =
      BOM +
      headers.join(",") +
      "\n" +
      rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="downloads-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting downloads:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء التصدير" },
      { status: 500 }
    );
  }
}
