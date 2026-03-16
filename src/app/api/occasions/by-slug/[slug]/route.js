import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/occasions/by-slug/[slug] — جلب مناسبة بقوالبها عبر الـ slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const occasion = await prisma.occasion.findUnique({
      where: { slug },
      include: {
        templates: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!occasion) {
      return NextResponse.json(
        { error: "المناسبة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(occasion);
  } catch (error) {
    console.error("Error fetching occasion:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المناسبة" },
      { status: 500 }
    );
  }
}
