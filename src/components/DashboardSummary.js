import React, { useMemo } from "react";
import { useDownload } from "@/lib/downloadContext";
import { useVisitor } from "@/lib/visitorContext";

const DashboardSummary = () => {
  const {
    downloadCount,
    downloadHistory,
    feedbackData,
    getDownloadsToday,
    getDownloadsThisWeek,
    getDownloadsThisMonth,
    getAverageRating,
  } = useDownload();

  const { visitorCount } = useVisitor();

  const metrics = useMemo(() => {
    // Calculate time periods
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const yesterday = today - 86400000;
    const lastWeek = today - 7 * 86400000;

    // Get download counts
    const todayDownloads = getDownloadsToday();
    const thisWeekDownloads = getDownloadsThisWeek();
    const thisMonthDownloads = getDownloadsThisMonth();

    // Calculate yesterday's downloads
    const yesterdayDownloads = downloadHistory.filter((item) => {
      const timestamp = item.timestamp;
      return timestamp >= yesterday && timestamp < today;
    }).length;

    // Calculate growth rates
    const dailyGrowth =
      yesterdayDownloads > 0
        ? Math.round(
            ((todayDownloads - yesterdayDownloads) / yesterdayDownloads) * 100
          )
        : todayDownloads > 0
        ? 100
        : 0;

    const lastWeekDownloads = downloadHistory.filter((item) => {
      const timestamp = item.timestamp;
      return timestamp >= lastWeek && timestamp < lastWeek + 7 * 86400000;
    }).length;

    const weeklyGrowth =
      lastWeekDownloads > 0
        ? Math.round(
            ((thisWeekDownloads - lastWeekDownloads) / lastWeekDownloads) * 100
          )
        : thisWeekDownloads > 0
        ? 100
        : 0;

    // Calculate conversion rates
    const conversionRate =
      visitorCount > 0 ? Math.round((downloadCount / visitorCount) * 100) : 0;

    // Calculate average rating
    const avgRating = getAverageRating();

    // Calculate feedback rate
    const feedbackRate =
      downloadCount > 0
        ? Math.round((feedbackData.length / downloadCount) * 100)
        : 0;

    // Get device breakdown
    const deviceData = downloadHistory.reduce((acc, item) => {
      const device = item.device || "Unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    // Calculate percentages for device data
    const deviceBreakdown = Object.entries(deviceData).map(
      ([device, count]) => ({
        device,
        count,
        percentage:
          downloadHistory.length > 0
            ? Math.round((count / downloadHistory.length) * 100)
            : 0,
      })
    );

    return {
      todayDownloads,
      thisWeekDownloads,
      thisMonthDownloads,
      dailyGrowth,
      weeklyGrowth,
      conversionRate,
      avgRating,
      feedbackRate,
      deviceBreakdown,
    };
  }, [
    downloadCount,
    downloadHistory,
    feedbackData,
    getDownloadsToday,
    getDownloadsThisWeek,
    getDownloadsThisMonth,
    getAverageRating,
    visitorCount,
  ]);

  const renderTrendIndicator = (growth) => {
    if (growth > 0) {
      return (
        <span className="flex items-center text-green-600 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
              clipRule="evenodd"
            />
          </svg>
          {growth}%
        </span>
      );
    } else if (growth < 0) {
      return (
        <span className="flex items-center text-red-600 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
              clipRule="evenodd"
            />
          </svg>
          {Math.abs(growth)}%
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-gray-500 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          0%
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-medium mb-6">ملخص الأداء</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Today's Downloads */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800">تحميلات اليوم</h4>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-blue-700">
              {metrics.todayDownloads}
            </p>
            {renderTrendIndicator(metrics.dailyGrowth)}
          </div>
        </div>

        {/* This Week's Downloads */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-indigo-800">
            تحميلات الأسبوع
          </h4>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-indigo-700">
              {metrics.thisWeekDownloads}
            </p>
            {renderTrendIndicator(metrics.weeklyGrowth)}
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-800">معدل التحويل</h4>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-green-700">
              {metrics.conversionRate}%
            </p>
            <span className="text-xs text-gray-500">للزيارات</span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800">متوسط التقييم</h4>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <p className="text-2xl font-bold text-yellow-700">
                {metrics.avgRating}
              </p>
              <div className="flex ml-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 ${
                      star <= Math.round(metrics.avgRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {metrics.feedbackRate}% ردود
            </span>
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      {metrics.deviceBreakdown.length > 0 && (
        <div>
          <h4 className="text-base font-medium mb-3">توزيع الأجهزة</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics.deviceBreakdown
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((item) => (
                  <div key={item.device} className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.device}</span>
                      <span className="text-xs text-gray-500">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {item.count} {item.count === 1 ? "مستخدم" : "مستخدمين"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSummary;
