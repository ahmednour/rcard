import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/downloads — تسجيل تحميل جديد
export async function POST(request) {
  try {
    const body = await request.json();
    const { templateId, userName, deptName, device, browser, os } = body;

    if (!templateId || !userName) {
      return NextResponse.json(
        { error: "templateId و userName مطلوبين" },
        { status: 400 }
      );
    }

    const download = await prisma.download.create({
      data: {
        templateId,
        userName,
        deptName: deptName || "",
        device: device || "",
        browser: browser || "",
        os: os || "",
      },
    });

    return NextResponse.json(download, { status: 201 });
  } catch (error) {
    console.error("Error creating download:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل التحميل" },
      { status: 500 }
    );
  }
}
