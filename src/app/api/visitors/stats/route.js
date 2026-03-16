import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/visitors/stats — إحصائيات الزوار
export async function GET() {
  try {
    const totalCount = await prisma.visitor.count();

    return NextResponse.json({ total: totalCount }, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب إحصائيات الزوار" },
      { status: 500 }
    );
  }
}
