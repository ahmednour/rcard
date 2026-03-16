import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/app/lib/session";

// PUT /api/templates/[id] — تعديل قالب
export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const template = await prisma.template.update({
      where: { id },
      data: {
        ...(body.nameX !== undefined && { nameX: body.nameX }),
        ...(body.nameY !== undefined && { nameY: body.nameY }),
        ...(body.deptX !== undefined && { deptX: body.deptX }),
        ...(body.deptY !== undefined && { deptY: body.deptY }),
        ...(body.fontSize !== undefined && { fontSize: body.fontSize }),
        ...(body.fontColor !== undefined && { fontColor: body.fontColor }),
        ...(body.fontFamily !== undefined && { fontFamily: body.fontFamily }),
        ...(body.deptFontSize !== undefined && { deptFontSize: body.deptFontSize }),
        ...(body.deptFontColor !== undefined && { deptFontColor: body.deptFontColor }),
        ...(body.deptFontFamily !== undefined && { deptFontFamily: body.deptFontFamily }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.imagePath && { imagePath: body.imagePath }),
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error updating template:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "القالب غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ error: "حدث خطأ أثناء تعديل القالب" }, { status: 500 });
  }
}

// DELETE /api/templates/[id] — حذف قالب
export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.template.delete({ where: { id } });

    return NextResponse.json({ message: "تم حذف القالب بنجاح" });
  } catch (error) {
    console.error("Error deleting template:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "القالب غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ error: "حدث خطأ أثناء حذف القالب" }, { status: 500 });
  }
}
