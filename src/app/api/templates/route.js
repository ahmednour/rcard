import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/app/lib/session";

// GET /api/templates?occasionId=xxx — جلب قوالب مناسبة معينة
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const occasionId = searchParams.get("occasionId");

    const where = occasionId ? { occasionId } : {};

    const templates = await prisma.template.findMany({
      where,
      include: { occasion: { select: { name: true, slug: true } } },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

// POST /api/templates — إنشاء قالب جديد
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { occasionId, imagePath, nameX, nameY, deptX, deptY, fontSize, fontColor, fontFamily, deptFontSize, deptFontColor, deptFontFamily, order } = body;

    if (!occasionId || !imagePath) {
      return NextResponse.json({ error: "occasionId و imagePath مطلوبين" }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        occasionId,
        imagePath,
        nameX: nameX || 0,
        nameY: nameY || 0,
        deptX: deptX || 0,
        deptY: deptY || 0,
        fontSize: fontSize || 36,
        fontColor: fontColor || "#f98500",
        fontFamily: fontFamily || "Alexandria",
        deptFontSize: deptFontSize || 26,
        deptFontColor: deptFontColor || "#8f5c22",
        deptFontFamily: deptFontFamily || "Alexandria",
        order: order || 0,
        isActive: true,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء القالب" }, { status: 500 });
  }
}
