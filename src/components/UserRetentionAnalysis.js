import React, { useMemo } from "react";
import { useDownload } from "../lib/downloadContext";

const UserRetentionAnalysis = () => {
  const { downloadHistory } = useDownload();

  const retentionData = useMemo(() => {
    if (!downloadHistory || downloadHistory.length === 0) {
      return {
        uniqueIps: 0,
        totalDownloads: 0,
        returningRate: 0,
        frequencyDistribution: [],
        timeBetweenDownloads: [],
      };
    }

    // Since we don't have IP information in localStorage, we'll use browser+device+os
    // as a proxy for uniqueness - not perfect but gives a sense of returning visits
    const uniqueIdentifiers = new Map();

    downloadHistory.forEach((item) => {
      if (!item.device || !item.browser || !item.os) return;

      // Create a unique identifier
      const identifier = `${item.browser}-${item.device}-${item.os}`;

      if (uniqueIdentifiers.has(identifier)) {
        // User returned, add this timestamp to their list
        uniqueIdentifiers.get(identifier).push(item.timestamp);
      } else {
        // First visit
        uniqueIdentifiers.set(identifier, [item.timestamp]);
      }
    });

    // Process the data
    const totalUsers = uniqueIdentifiers.size;
    const totalDownloads = downloadHistory.length;

    // Count users who downloaded more than once
    let returningUsers = 0;
    let downloadsPerUser = [];
    let timeBetweenDownloads = [];

    uniqueIdentifiers.forEach((timestamps, identifier) => {
      // Sort timestamps chronologically
      timestamps.sort();

      // Record number of downloads per user
      downloadsPerUser.push({
        count: timestamps.length,
        identifier,
      });

      if (timestamps.length > 1) {
        returningUsers++;

        // Calculate time between downloads for this user
        for (let i = 1; i < timestamps.length; i++) {
          const prevTime = new Date(timestamps[i - 1]).getTime();
          const currTime = new Date(timestamps[i]).getTime();
          const hoursDiff = (currTime - prevTime) / (1000 * 60 * 60);

          timeBetweenDownloads.push({
            hours: Math.round(hoursDiff),
            prevTime: timestamps[i - 1],
            currTime: timestamps[i],
          });
        }
      }
    });

    // Calculate returning rate
    const returningRate =
      totalUsers > 0 ? Math.round((returningUsers / totalUsers) * 100) : 0;

    // Group downloads per user into frequency distribution
    const frequencyDistribution = [
      { downloads: "1", count: 0, percentage: 0 },
      { downloads: "2", count: 0, percentage: 0 },
      { downloads: "3", count: 0, percentage: 0 },
      { downloads: "4", count: 0, percentage: 0 },
      { downloads: "5+", count: 0, percentage: 0 },
    ];

    downloadsPerUser.forEach(({ count }) => {
      const index = Math.min(count - 1, 4);
      frequencyDistribution[index].count++;
    });

    // Calculate percentages
    frequencyDistribution.forEach((item) => {
      item.percentage =
        totalUsers > 0 ? Math.round((item.count / totalUsers) * 100) : 0;
    });

    // Analyze time between downloads
    const categorizeTimeDiff = (hours) => {
      if (hours < 1) return "أقل من ساعة";
      if (hours < 24) return "خلال اليوم";
      if (hours < 24 * 7) return "خلال الأسبوع";
      if (hours < 24 * 30) return "خلال الشهر";
      return "أكثر من شهر";
    };

    const timeBuckets = {
      "أقل من ساعة": 0,
      "خلال اليوم": 0,
      "خلال الأسبوع": 0,
      "خلال الشهر": 0,
      "أكثر من شهر": 0,
    };

    timeBetweenDownloads.forEach(({ hours }) => {
      const category = categorizeTimeDiff(hours);
      timeBuckets[category]++;
    });

    // Convert to array for rendering
    const timeCategories = Object.entries(timeBuckets).map(
      ([category, count]) => ({
        category,
        count,
        percentage:
          timeBetweenDownloads.length > 0
            ? Math.round((count / timeBetweenDownloads.length) * 100)
            : 0,
      })
    );

    return {
      uniqueUsers: totalUsers,
      totalDownloads,
      returningUsers,
      returningRate,
      frequencyDistribution,
      timeCategories,
      avgDownloadsPerUser:
        totalUsers > 0
          ? Math.round((totalDownloads / totalUsers) * 10) / 10
          : 0,
    };
  }, [downloadHistory]);

  // No data to display
  if (downloadHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium mb-4">تحليل سلوك المستخدمين</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-green-800 mb-2">
            مستخدمون فريدون
          </h4>
          <p className="text-2xl font-bold text-green-700">
            {retentionData.uniqueUsers}
          </p>
          <p className="text-sm text-green-600 mt-1">
            تقدير تقريبي بناءً على الجهاز والمتصفح
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-amber-800 mb-2">
            معدل العودة
          </h4>
          <p className="text-2xl font-bold text-amber-700">
            {retentionData.returningRate}%
          </p>
          <p className="text-sm text-amber-600 mt-1">
            نسبة المستخدمين الذين عادوا للتحميل مرة أخرى
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-purple-800 mb-2">
            معدل التحميل
          </h4>
          <p className="text-2xl font-bold text-purple-700">
            {retentionData.avgDownloadsPerUser}
          </p>
          <p className="text-sm text-purple-600 mt-1">
            متوسط عدد التحميلات لكل مستخدم
          </p>
        </div>
      </div>

      {/* Frequency Distribution */}
      <div className="mb-6">
        <h4 className="text-base font-medium mb-3">توزيع عدد مرات التحميل</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-5 gap-2">
            {retentionData.frequencyDistribution.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex-1 flex items-end w-full">
                  <div
                    className="w-full bg-indigo-400 rounded-t"
                    style={{
                      height: `${Math.max(5, item.percentage)}%`,
                      minHeight: "20px",
                    }}
                  ></div>
                </div>
                <div className="text-xs mt-1">{item.downloads} مرة</div>
                <div className="text-xs text-gray-500">{item.count} مستخدم</div>
                <div className="text-xs text-gray-500">
                  ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Between Downloads */}
      {retentionData.timeCategories.some((item) => item.count > 0) && (
        <div className="mb-4">
          <h4 className="text-base font-medium mb-3">
            الوقت بين التحميلات المتكررة
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              {retentionData.timeCategories
                .filter((item) => item.count > 0)
                .map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{item.category}</span>
                      <span className="text-xs text-gray-500">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Interpretation */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
        <h4 className="font-medium mb-2">تحليل النتائج</h4>
        <p>
          {retentionData.returningRate > 50
            ? "نسبة العودة مرتفعة، مما يدل على رضا المستخدمين وقيمة البطاقات المقدمة."
            : retentionData.returningRate > 20
            ? "نسبة العودة متوسطة، هناك فرصة لتحسين جاذبية البطاقات لتشجيع المزيد من العودة."
            : "نسبة العودة منخفضة، ينصح بتحسين جودة البطاقات وتوفير المزيد من الخيارات."}
          &nbsp;
          {retentionData.avgDownloadsPerUser > 3
            ? "معدل التحميل مرتفع لكل مستخدم، مما يعكس استخدامًا متكررًا."
            : "هناك فرصة لزيادة معدل التحميل لكل مستخدم من خلال تنويع البطاقات."}
        </p>
      </div>
    </div>
  );
};

export default UserRetentionAnalysis;
