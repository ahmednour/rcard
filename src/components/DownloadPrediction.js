import React, { useMemo } from "react";
import { useDownload } from "../lib/downloadContext";

const DownloadPrediction = () => {
  const { downloadHistory } = useDownload();

  const predictionData = useMemo(() => {
    if (!downloadHistory || downloadHistory.length < 7) {
      return {
        hasEnoughData: false,
        message: "تحتاج إلى بيانات أكثر للتنبؤ (على الأقل 7 أيام)",
        nextWeekPrediction: 0,
        nextMonthPrediction: 0,
        trend: "neutral",
        confidence: "low",
      };
    }

    // Group downloads by day
    const downloadsByDay = {};
    let firstDate = null;

    downloadHistory.forEach((item) => {
      const date = new Date(item.timestamp);
      const dateStr = date.toISOString().split("T")[0];

      if (!firstDate || date < firstDate) {
        firstDate = date;
      }

      if (downloadsByDay[dateStr]) {
        downloadsByDay[dateStr]++;
      } else {
        downloadsByDay[dateStr] = 1;
      }
    });

    // Fill in missing days with zero downloads
    if (firstDate) {
      const today = new Date();
      const diffTime = Math.abs(today - firstDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      for (let i = 0; i <= diffDays; i++) {
        const date = new Date(firstDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        if (!downloadsByDay[dateStr]) {
          downloadsByDay[dateStr] = 0;
        }
      }
    }

    // Convert to array and sort by date
    const dailyData = Object.entries(downloadsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Use linear regression for prediction
    const xValues = Array.from({ length: dailyData.length }, (_, i) => i);
    const yValues = dailyData.map((day) => day.count);

    // Calculate the coefficients for y = mx + b
    const n = xValues.length;
    const sumX = xValues.reduce((sum, x) => sum + x, 0);
    const sumY = yValues.reduce((sum, y) => sum + y, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict function
    const predict = (days) => {
      return Math.max(0, Math.round(slope * (n + days) + intercept));
    };

    // Calculate R-squared (coefficient of determination)
    const meanY = sumY / n;
    const totalVariation = yValues.reduce(
      (sum, y) => sum + Math.pow(y - meanY, 2),
      0
    );
    const residualVariation = yValues.reduce((sum, y, i) => {
      const predicted = slope * xValues[i] + intercept;
      return sum + Math.pow(y - predicted, 2);
    }, 0);
    const rSquared = 1 - residualVariation / totalVariation;

    // Recent trend analysis
    const recentDays = Math.min(7, dailyData.length);
    const recentData = dailyData.slice(-recentDays);

    const weekTotal = recentData.reduce((sum, day) => sum + day.count, 0);
    const weekAvg = weekTotal / recentDays;

    const prevWeekData = dailyData.slice(-recentDays * 2, -recentDays);
    const prevWeekTotal =
      prevWeekData.length > 0
        ? prevWeekData.reduce((sum, day) => sum + day.count, 0)
        : 0;
    const prevWeekAvg =
      prevWeekData.length > 0 ? prevWeekTotal / prevWeekData.length : 0;

    // Determine trend
    let trend = "neutral";
    if (weekAvg > prevWeekAvg * 1.15) {
      trend = "up";
    } else if (weekAvg < prevWeekAvg * 0.85) {
      trend = "down";
    }

    // Confidence level based on R-squared and data amount
    let confidence = "low";
    if (rSquared > 0.7 && dailyData.length > 14) {
      confidence = "high";
    } else if (rSquared > 0.5 && dailyData.length > 10) {
      confidence = "medium";
    }

    // Predictions
    const nextWeekPrediction = predict(7);
    const nextMonthPrediction = predict(30);

    return {
      hasEnoughData: true,
      dailyData: dailyData.slice(-14), // Last 14 days
      trend,
      confidence,
      rSquared: Math.round(rSquared * 100) / 100,
      nextWeekPrediction,
      nextMonthPrediction,
      weeklyGrowthRate:
        prevWeekAvg > 0
          ? Math.round(((weekAvg - prevWeekAvg) / prevWeekAvg) * 100)
          : 0,
    };
  }, [downloadHistory]);

  // Not enough data
  if (!predictionData.hasEnoughData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium mb-4">تنبؤات التحميل المستقبلية</h3>
        <div className="bg-yellow-50 p-4 rounded text-yellow-700 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline-block mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {predictionData.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium mb-4">تنبؤات التحميل المستقبلية</h3>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-indigo-800 mb-2">
            الأسبوع القادم
          </h4>
          <p className="text-2xl font-bold text-indigo-700">
            {predictionData.nextWeekPrediction}
          </p>
          <p className="text-sm text-indigo-600 mt-1">
            تحميلات متوقعة خلال 7 أيام
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-purple-800 mb-2">
            الشهر القادم
          </h4>
          <p className="text-2xl font-bold text-purple-700">
            {predictionData.nextMonthPrediction}
          </p>
          <p className="text-sm text-purple-600 mt-1">
            تحميلات متوقعة خلال 30 يوم
          </p>
        </div>

        <div
          className={`${
            predictionData.trend === "up"
              ? "bg-green-50"
              : predictionData.trend === "down"
              ? "bg-red-50"
              : "bg-gray-50"
          } p-4 rounded-lg`}
        >
          <h4
            className={`text-base font-medium ${
              predictionData.trend === "up"
                ? "text-green-800"
                : predictionData.trend === "down"
                ? "text-red-800"
                : "text-gray-800"
            } mb-2`}
          >
            معدل النمو الأسبوعي
          </h4>
          <p
            className={`text-2xl font-bold ${
              predictionData.trend === "up"
                ? "text-green-700"
                : predictionData.trend === "down"
                ? "text-red-700"
                : "text-gray-700"
            }`}
          >
            {predictionData.weeklyGrowthRate}%
          </p>
          <p
            className={`text-sm ${
              predictionData.trend === "up"
                ? "text-green-600"
                : predictionData.trend === "down"
                ? "text-red-600"
                : "text-gray-600"
            } mt-1 flex items-center`}
          >
            {predictionData.trend === "up" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
            {predictionData.trend === "down" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
            {predictionData.trend === "up"
              ? "نمو تصاعدي"
              : predictionData.trend === "down"
              ? "تراجع"
              : "مستقر"}
          </p>
        </div>
      </div>

      {/* Recent Data Chart */}
      <div className="mb-6">
        <h4 className="text-base font-medium mb-3">تحميلات آخر 14 يومًا</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-end h-32 space-x-1 rtl:space-x-reverse">
            {predictionData.dailyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex-1 flex items-end w-full">
                  <div
                    className="w-full bg-blue-400 rounded-t"
                    style={{
                      height: `${Math.max(
                        5,
                        (day.count /
                          Math.max(
                            ...predictionData.dailyData.map((d) => d.count)
                          )) *
                          100
                      )}%`,
                      minHeight: "1px",
                    }}
                  ></div>
                </div>
                <div className="text-xs mt-1 transform -rotate-45 origin-top-left rtl:origin-top-right w-8 truncate">
                  {new Date(day.date).toLocaleDateString("ar-EG", {
                    day: "numeric",
                    month: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">مستوى الثقة بالتنبؤ</span>
          <span className="text-xs">
            {predictionData.confidence === "high"
              ? "مرتفع"
              : predictionData.confidence === "medium"
              ? "متوسط"
              : "منخفض"}
            ({predictionData.rSquared})
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              predictionData.confidence === "high"
                ? "bg-green-500"
                : predictionData.confidence === "medium"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${
                predictionData.confidence === "high"
                  ? 100
                  : predictionData.confidence === "medium"
                  ? 65
                  : 33
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
        <h4 className="font-medium mb-2">ملاحظة عن التنبؤات</h4>
        <p>
          تستند هذه التنبؤات إلى تحليل الاتجاهات السابقة للتحميلات وقد تختلف عن
          الأرقام الفعلية. كلما زادت البيانات المتوفرة، زادت دقة التنبؤات.
          المحتوى الجديد والمناسبات يمكن أن تؤثر على معدلات التحميل.
        </p>
      </div>
    </div>
  );
};

export default DownloadPrediction;
