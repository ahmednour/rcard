import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/feedback — إرسال تقييم جديد
export async function POST(request) {
  try {
    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "التقييم مطلوب ويجب أن يكون بين 1 و 5" },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        rating,
        comment: comment || "",
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ التقييم" },
      { status: 500 }
    );
  }
}

// GET /api/feedback — جلب التقييمات
export async function GET() {
  try {
    const [feedbacks, stats] = await Promise.all([
      prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.feedback.aggregate({
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    // توزيع التقييمات
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const allFeedbacks = await prisma.feedback.findMany({
      select: { rating: true },
    });
    allFeedbacks.forEach((f) => {
      distribution[f.rating] = (distribution[f.rating] || 0) + 1;
    });

    return NextResponse.json({
      feedbacks,
      averageRating: Math.round((stats._avg.rating || 0) * 10) / 10,
      totalCount: stats._count,
      distribution,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب التقييمات" },
      { status: 500 }
    );
  }
}
