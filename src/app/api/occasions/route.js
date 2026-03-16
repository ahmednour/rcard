import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/app/lib/session";

// GET /api/occasions — جلب كل المناسبات (النشطة فقط للمستخدم العادي)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const where = all ? {} : { isActive: true };

    const occasions = await prisma.occasion.findMany({
      where,
      include: {
        templates: {
          where: all ? {} : { isActive: true },
          orderBy: { order: "asc" },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // إضافة عدد القوالب لكل مناسبة
    const result = occasions.map((o) => ({
      ...o,
      templateCount: o.templates.length,
      templates: undefined,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching occasions:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المناسبات" },
      { status: 500 }
    );
  }
}

// POST /api/occasions — إضافة مناسبة جديدة (محمية بـ auth)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, startDate, endDate, isActive } = body;

    if (!name || !slug || !startDate || !endDate) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة (name, slug, startDate, endDate)" },
        { status: 400 }
      );
    }

    const occasion = await prisma.occasion.create({
      data: {
        name,
        slug,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive !== false,
      },
    });

    return NextResponse.json(occasion, { status: 201 });
  } catch (error) {
    console.error("Error creating occasion:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "هذا الـ slug مستخدم بالفعل" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء المناسبة" },
      { status: 500 }
    );
  }
}
