import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/downloads/stats — إحصائيات التحميلات
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const occasionId = searchParams.get("occasionId");

    const now = new Date();

    // فلتر التاريخ
    const dateFilter = {};
    if (from) dateFilter.gte = new Date(from + "T00:00:00");
    if (to) dateFilter.lte = new Date(to + "T23:59:59");

    const baseWhere = {
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      ...(occasionId && { template: { occasionId } }),
    };

    // بداية اليوم
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // بداية الأسبوع (الأحد)
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    // بداية الشهر
    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // 7 أيام من الآن
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalCount,
      todayCount,
      weekCount,
      monthCount,
      recentDownloads,
      last7DaysDownloads,
      occasionStats,
      templateStats,
    ] = await Promise.all([
      prisma.download.count({ where: baseWhere }),
      prisma.download.count({
        where: { ...baseWhere, createdAt: { ...dateFilter, gte: todayStart } },
      }),
      prisma.download.count({
        where: { ...baseWhere, createdAt: { ...dateFilter, gte: weekStart } },
      }),
      prisma.download.count({
        where: { ...baseWhere, createdAt: { ...dateFilter, gte: monthStart } },
      }),
      prisma.download.findMany({
        where: baseWhere,
        orderBy: { createdAt: "desc" },
        take: 5,
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
              imagePath: true,
              occasion: { select: { name: true } },
            },
          },
        },
      }),
      prisma.download.findMany({
        where: {
          ...baseWhere,
          createdAt: { ...dateFilter, gte: sevenDaysAgo },
        },
        select: { createdAt: true, device: true, browser: true, os: true },
      }),
      // إحصائيات حسب المناسبة
      prisma.occasion.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              templates: {
                where: {
                  downloads: {
                    some: baseWhere,
                  },
                },
              },
            },
          },
          templates: {
            select: {
              _count: {
                select: {
                  downloads: {
                    where: baseWhere,
                  },
                },
              },
            },
          },
        },
      }),
      // إحصائيات حسب القالب
      prisma.template.findMany({
        where: occasionId ? { occasionId } : undefined,
        select: {
          id: true,
          imagePath: true,
          occasionId: true,
          occasion: { select: { name: true } },
          _count: {
            select: {
              downloads: {
                where: baseWhere,
              },
            },
          },
        },
        orderBy: { order: "asc" },
      }),
    ]);

    // إحصائيات الأجهزة
    const deviceStats = { device: {}, browser: {}, os: {} };
    last7DaysDownloads.forEach((d) => {
      if (d.device)
        deviceStats.device[d.device] =
          (deviceStats.device[d.device] || 0) + 1;
      if (d.browser)
        deviceStats.browser[d.browser] =
          (deviceStats.browser[d.browser] || 0) + 1;
      if (d.os)
        deviceStats.os[d.os] = (deviceStats.os[d.os] || 0) + 1;
    });

    // تحميلات حسب اليوم (آخر 7 أيام)
    const downloadsByDay = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("ar-SA", { weekday: "short" });
      downloadsByDay[dayName] = 0;

      last7DaysDownloads.forEach((d) => {
        if (new Date(d.createdAt).toISOString().split("T")[0] === dateStr) {
          downloadsByDay[dayName]++;
        }
      });
    }

    // تجميع إحصائيات المناسبات
    const occasionBreakdown = occasionStats.map((o) => ({
      id: o.id,
      name: o.name,
      slug: o.slug,
      templateCount: o.templates.length,
      downloadCount: o.templates.reduce(
        (sum, t) => sum + t._count.downloads,
        0
      ),
    })).sort((a, b) => b.downloadCount - a.downloadCount);

    // تجميع إحصائيات القوالب
    const templateBreakdown = templateStats.map((t) => ({
      id: t.id,
      imagePath: t.imagePath,
      occasionId: t.occasionId,
      occasionName: t.occasion.name,
      downloadCount: t._count.downloads,
    })).sort((a, b) => b.downloadCount - a.downloadCount);

    return NextResponse.json({
      total: totalCount,
      today: todayCount,
      week: weekCount,
      month: monthCount,
      recentDownloads,
      downloadsByDay,
      deviceStats,
      occasionBreakdown,
      templateBreakdown,
    });
  } catch (error) {
    console.error("Error fetching download stats:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الإحصائيات" },
      { status: 500 }
    );
  }
}
