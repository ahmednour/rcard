import React, { useMemo } from "react";
import { useDownload } from "@/lib/downloadContext";

const DownloadTimeAnalysis = () => {
  const { downloadHistory } = useDownload();

  const timeAnalysis = useMemo(() => {
    // Skip analysis if no download history
    if (!downloadHistory || downloadHistory.length === 0) {
      return { hours: {}, days: {} };
    }

    // Initialize counters
    const hourCounts = {};
    const dayCounts = {};

    // Initialize all hours (0-23)
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0;
    }

    // Initialize all days (0-6, Sunday-Saturday)
    const dayNames = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    dayNames.forEach((day, index) => {
      dayCounts[index] = {
        name: day,
        count: 0,
      };
    });

    // Count downloads by hour and day
    downloadHistory.forEach((item) => {
      const date = new Date(item.timestamp);
      const hour = date.getHours();
      const day = date.getDay(); // 0-6

      hourCounts[hour]++;
      dayCounts[day].count++;
    });

    // Convert to arrays for easier rendering
    const hourData = Object.entries(hourCounts).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
      percentage: Math.round((count / downloadHistory.length) * 100),
    }));

    const dayData = Object.values(dayCounts);

    // Find peak times
    const peakHour = [...hourData].sort((a, b) => b.count - a.count)[0];
    const peakDay = [...dayData].sort((a, b) => b.count - a.count)[0];

    return {
      hours: hourData,
      days: dayData,
      peakHour,
      peakDay,
      total: downloadHistory.length,
    };
  }, [downloadHistory]);

  // No data to show
  if (downloadHistory.length === 0) {
    return null;
  }

  // Get time period description
  const getTimePeriod = (hour) => {
    if (hour >= 5 && hour < 12) return "صباحاً";
    if (hour >= 12 && hour < 17) return "ظهراً";
    if (hour >= 17 && hour < 21) return "مساءً";
    return "ليلاً";
  };

  // Format hour for display
  const formatHour = (hour) => {
    const period = getTimePeriod(hour);

    // Convert to 12-hour format
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;

    return `${displayHour} ${period}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium mb-4">تحليل أوقات التحميل</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-blue-800 mb-2">
            وقت الذروة
          </h4>
          <p className="text-2xl font-bold text-blue-700">
            {formatHour(timeAnalysis.peakHour.hour)}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {timeAnalysis.peakHour.count} تحميل (
            {timeAnalysis.peakHour.percentage}% من الإجمالي)
          </p>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-indigo-800 mb-2">
            يوم الذروة
          </h4>
          <p className="text-2xl font-bold text-indigo-700">
            {timeAnalysis.peakDay.name}
          </p>
          <p className="text-sm text-indigo-600 mt-1">
            {timeAnalysis.peakDay.count} تحميل (
            {Math.round(
              (timeAnalysis.peakDay.count / timeAnalysis.total) * 100
            )}
            % من الإجمالي)
          </p>
        </div>
      </div>

      {/* Hour of Day Analysis */}
      <div className="mb-6">
        <h4 className="text-base font-medium mb-3">
          التحميلات حسب ساعات اليوم
        </h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-end h-40 space-x-1 rtl:space-x-reverse">
            {timeAnalysis.hours.map(({ hour, count, percentage }) => {
              // Find max count to normalize heights
              const maxCount = Math.max(
                ...timeAnalysis.hours.map((h) => h.count)
              );
              const height =
                maxCount > 0 ? Math.max(5, (count / maxCount) * 100) : 0;

              return (
                <div key={hour} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t ${
                      timeAnalysis.peakHour.hour === hour
                        ? "bg-blue-500"
                        : "bg-blue-300"
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs mt-1 -rotate-45 origin-top-left w-full text-center">
                    {hour}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xs text-center mt-8 text-gray-500">
            ساعات اليوم (24 ساعة)
          </div>
        </div>
      </div>

      {/* Day of Week Analysis */}
      <div className="mb-4">
        <h4 className="text-base font-medium mb-3">
          التحميلات حسب أيام الأسبوع
        </h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-7 gap-2">
            {timeAnalysis.days.map((day, index) => {
              const percentage = Math.round(
                (day.count / timeAnalysis.total) * 100
              );
              const isPeakDay = day.name === timeAnalysis.peakDay.name;

              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className={`h-2 rounded-full ${
                        isPeakDay ? "bg-indigo-600" : "bg-indigo-400"
                      }`}
                      style={{ width: `${percentage || 1}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium">{day.name}</span>
                  <span className="text-xs text-gray-500">{day.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        تم التحليل بناءً على {timeAnalysis.total} تحميل
      </div>
    </div>
  );
};

export default DownloadTimeAnalysis;
