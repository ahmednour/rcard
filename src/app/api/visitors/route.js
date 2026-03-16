import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/visitors — تسجيل زيارة جديدة
export async function POST(request) {
  try {
    const body = await request.json();
    const { page } = body;

    const visitor = await prisma.visitor.create({
      data: { page: page || "/" },
    });

    return NextResponse.json(visitor, { status: 201 });
  } catch (error) {
    console.error("Error creating visitor:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الزيارة" },
      { status: 500 }
    );
  }
}
