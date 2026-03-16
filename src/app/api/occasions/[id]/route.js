import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/app/lib/session";

// PUT /api/occasions/[id] — تعديل مناسبة
export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, startDate, endDate, isActive } = body;

    const occasion = await prisma.occasion.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(occasion);
  } catch (error) {
    console.error("Error updating occasion:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "هذا الـ slug مستخدم بالفعل" }, { status: 409 });
    }
    return NextResponse.json({ error: "حدث خطأ أثناء تعديل المناسبة" }, { status: 500 });
  }
}

// DELETE /api/occasions/[id] — حذف مناسبة
export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.occasion.delete({ where: { id } });

    return NextResponse.json({ message: "تم حذف المناسبة بنجاح" });
  } catch (error) {
    console.error("Error deleting occasion:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }
    return NextResponse.json({ error: "حدث خطأ أثناء حذف المناسبة" }, { status: 500 });
  }
}
