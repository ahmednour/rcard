"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { adminLogout } from "./login/actions";

const MILESTONES = [10, 25, 50, 100, 250, 500, 1000];

export default function AdminPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="flex space-x-4 rtl:space-x-reverse flex-wrap gap-2">
          <Link
            href="/admin/occasions"
            className="bg-[#83923b] text-white hover:bg-[#6b7830] py-2 px-4 rounded-lg text-sm"
          >
            إدارة المناسبات
          </Link>
          <Link
            href="/admin/templates/new"
            className="bg-amber-600 text-white hover:bg-amber-700 py-2 px-4 rounded-lg text-sm"
          >
            إدارة القوالب
          </Link>
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
          >
            العودة للرئيسية
          </Link>
          <form action={adminLogout} className="inline">
            <button
              type="submit"
              className="bg-red-100 text-red-700 hover:bg-red-200 py-2 px-4 rounded-lg text-sm"
            >
              تسجيل الخروج
            </button>
          </form>
        </div>
      </div>
      <StatsDisplay />
    </div>
  );
}

function StatsDisplay() {
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // فلاتر
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedOccasionId, setSelectedOccasionId] = useState("");
  const [occasions, setOccasions] = useState([]);

  // جلب المناسبات
  useEffect(() => {
    fetch("/api/occasions?all=true")
      .then((r) => r.json())
      .then(setOccasions)
      .catch(console.error);
  }, []);

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    if (selectedOccasionId) params.set("occasionId", selectedOccasionId);
    const qs = params.toString() ? `?${params.toString()}` : "";

    Promise.all([
      fetch(`/api/downloads/stats${qs}`).then((r) => r.json()),
      fetch("/api/feedback").then((r) => r.json()),
      fetch("/api/visitors/stats").then((r) => r.json()),
    ])
      .then(([downloadStats, feedbackData, visitorStats]) => {
        setStats(downloadStats);
        setFeedback(feedbackData);
        setVisitorCount(visitorStats.total || 0);
      })
      .catch((err) => console.error("Error fetching admin data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    fetchData();
  };

  const handleResetFilter = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedOccasionId("");
    // سنعيد الجلب بعد reset
    setTimeout(() => fetchData(), 0);
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    if (selectedOccasionId) params.set("occasionId", selectedOccasionId);
    const qs = params.toString() ? `?${params.toString()}` : "";
    window.open(`/api/downloads/export${qs}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#84923a]"></div>
      </div>
    );
  }

  if (!stats) return <p className="text-center text-gray-500">لا توجد بيانات</p>;

  const downloadCount = stats.total || 0;
  const todayDownloads = stats.today || 0;
  const weekDownloads = stats.week || 0;
  const monthDownloads = stats.month || 0;
  const downloadsByDay = stats.downloadsByDay || {};
  const deviceStats = stats.deviceStats || { device: {}, browser: {}, os: {} };
  const recentDownloads = stats.recentDownloads || [];
  const occasionBreakdown = stats.occasionBreakdown || [];
  const templateBreakdown = stats.templateBreakdown || [];

  const conversionRate = visitorCount > 0 ? Math.round((downloadCount / visitorCount) * 100) : 0;

  const averageRating = feedback?.averageRating || 0;
  const feedbackCount = feedback?.totalCount || 0;
  const feedbackRate = downloadCount > 0 ? Math.round((feedbackCount / downloadCount) * 100) : 0;
  const feedbacks = feedback?.feedbacks || [];
  const distribution = feedback?.distribution || {};

  const chartData = Object.entries(downloadsByDay).map(([day, count]) => ({ day, count }));

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* فلاتر */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-sm font-medium mb-3">فلترة الإحصائيات</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">من تاريخ</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">إلى تاريخ</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">المناسبة</label>
            <select
              value={selectedOccasionId}
              onChange={(e) => setSelectedOccasionId(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            >
              <option value="">كل المناسبات</option>
              {occasions.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="bg-[#83923b] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#6b7830] flex-1"
            >
              تطبيق
            </button>
            <button
              onClick={handleResetFilter}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300"
            >
              إعادة
            </button>
          </div>
        </div>
      </div>

      {/* ملخص سريع */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-sm text-blue-800">إجمالي التحميلات</p>
          <p className="text-3xl font-bold text-blue-600">{downloadCount}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-sm text-green-800">إجمالي الزوار</p>
          <p className="text-3xl font-bold text-green-600">{visitorCount}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-sm text-purple-800">معدل التحويل</p>
          <p className="text-3xl font-bold text-purple-600">{conversionRate}%</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg text-center">
          <p className="text-sm text-amber-800">متوسط التقييم</p>
          <p className="text-3xl font-bold text-amber-600">{averageRating} / 5</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* إحصائيات التحميل */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">إحصائيات التحميل</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-sm font-medium text-amber-800 mb-1">اليوم</p>
              <p className="text-2xl font-bold text-amber-600">{todayDownloads}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm font-medium text-purple-800 mb-1">هذا الأسبوع</p>
              <p className="text-2xl font-bold text-purple-600">{weekDownloads}</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg text-center">
              <p className="text-sm font-medium text-cyan-800 mb-1">هذا الشهر</p>
              <p className="text-2xl font-bold text-cyan-600">{monthDownloads}</p>
            </div>
          </div>
        </div>

        {/* إحصائيات حسب المناسبة */}
        {occasionBreakdown.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">التحميلات حسب المناسبة</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-right p-3 text-sm font-medium">المناسبة</th>
                    <th className="text-center p-3 text-sm font-medium">القوالب</th>
                    <th className="text-center p-3 text-sm font-medium">التحميلات</th>
                    <th className="text-center p-3 text-sm font-medium">النسبة</th>
                  </tr>
                </thead>
                <tbody>
                  {occasionBreakdown.map((o) => {
                    const pct = downloadCount > 0 ? Math.round((o.downloadCount / downloadCount) * 100) : 0;
                    return (
                      <tr key={o.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">{o.name}</td>
                        <td className="p-3 text-center text-gray-500">{o.templateCount}</td>
                        <td className="p-3 text-center font-bold text-[#83923b]">{o.downloadCount}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-[#83923b] h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* إحصائيات حسب القالب */}
        {templateBreakdown.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">التحميلات حسب القالب (أعلى 10)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {templateBreakdown.slice(0, 10).map((t) => (
                <div key={t.id} className="border rounded-lg p-2 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.imagePath}
                    alt="قالب"
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <p className="text-xs text-gray-500 truncate">{t.occasionName}</p>
                  <p className="text-lg font-bold text-[#83923b]">{t.downloadCount}</p>
                  <p className="text-xs text-gray-400">تحميل</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* رسم بياني */}
        {chartData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">التحميلات حسب اليوم (آخر 7 أيام)</h3>
            <div className="h-40 flex items-end justify-between p-2 border rounded-lg">
              {chartData.map(({ day, count }) => (
                <div key={day} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-[#83923b] w-8 rounded-t-md"
                    style={{
                      height: `${
                        count
                          ? Math.max(10, (count / Math.max(...chartData.map((d) => d.count))) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                  <div className="text-xs mt-1">{day}</div>
                  <div className="text-xs font-medium">{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* آخر 5 تحميلات */}
        {recentDownloads.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">آخر التحميلات</h3>
            <div className="overflow-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-right p-2 text-xs font-medium">الاسم</th>
                    <th className="text-right p-2 text-xs font-medium">الإدارة</th>
                    <th className="text-right p-2 text-xs font-medium">المناسبة</th>
                    <th className="text-right p-2 text-xs font-medium">الجهاز</th>
                    <th className="text-right p-2 text-xs font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDownloads.map((item) => (
                    <tr key={item.id} className="border-t text-sm">
                      <td className="p-2">{item.userName}</td>
                      <td className="p-2 text-gray-500">{item.deptName}</td>
                      <td className="p-2 text-gray-500">{item.template?.occasion?.name || "-"}</td>
                      <td className="p-2 text-xs text-gray-400">{item.device} {item.browser}</td>
                      <td className="p-2 text-xs text-gray-400">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* إحصائيات الأجهزة */}
        {Object.keys(deviceStats.device).length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">إحصائيات الأجهزة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              {[
                { title: "نوع الجهاز", data: deviceStats.device, bgColor: "bg-blue-500" },
                { title: "المتصفح", data: deviceStats.browser, bgColor: "bg-purple-500" },
                { title: "نظام التشغيل", data: deviceStats.os, bgColor: "bg-green-500" },
              ].map(({ title, data, bgColor }) => (
                <div key={title} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-base font-medium mb-3">{title}</h4>
                  {Object.entries(data)
                    .sort(([, a], [, b]) => b - a)
                    .map(([label, count]) => {
                      const total = Object.values(data).reduce((s, v) => s + v, 0);
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={label} className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{label}</span>
                            <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`${bgColor} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* المعالم الهامة */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">المعالم الهامة</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {MILESTONES.map((milestone) => (
                <span
                  key={milestone}
                  className={`text-xs px-3 py-1 rounded-full ${
                    downloadCount >= milestone
                      ? "bg-[#83923b] text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {milestone} {downloadCount >= milestone ? "✓" : ""}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* التقييمات */}
        {feedbackCount > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">تقييمات المستخدمين</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="text-base font-medium text-indigo-800 mb-1">متوسط التقييم</h4>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-indigo-700">{averageRating}</p>
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">من {feedbackCount} تقييم</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <h4 className="text-base font-medium text-pink-800 mb-1">معدل التقييم</h4>
                <p className="text-2xl font-bold text-pink-700">{feedbackRate}%</p>
                <p className="text-xs text-gray-600 mt-1">نسبة التحميلات التي تم تقييمها</p>
              </div>
            </div>

            {/* توزيع التقييمات */}
            <div className="mb-6">
              <h4 className="text-base font-medium mb-3">توزيع التقييمات</h4>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating] || 0;
                const pct = feedbackCount > 0 ? Math.round((count / feedbackCount) * 100) : 0;
                return (
                  <div key={rating} className="mb-2 flex items-center">
                    <div className="flex items-center w-12">
                      <span className="text-sm mr-1">{rating}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm text-gray-600">{count} ({pct}%)</div>
                  </div>
                );
              })}
            </div>

            {/* آخر التعليقات */}
            {feedbacks.some((f) => f.comment) && (
              <div>
                <h4 className="text-base font-medium mb-3">آخر التعليقات</h4>
                <div className="overflow-auto max-h-40 border rounded-lg p-2">
                  <ul className="space-y-1">
                    {feedbacks
                      .filter((f) => f.comment)
                      .slice(0, 5)
                      .map((item) => (
                        <li key={item.id} className="text-sm py-2 border-b last:border-0">
                          <div className="flex items-center mb-1">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${star <= item.rating ? "text-yellow-400" : "text-gray-300"}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                          </div>
                          <p className="text-gray-700">{item.comment}</p>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* أزرار التحكم */}
        <div className="border-t pt-6 flex gap-3 flex-wrap">
          <button
            onClick={fetchData}
            className="bg-[#83923b] hover:bg-[#6b7830] text-white px-4 py-2 rounded-lg text-sm"
          >
            تحديث البيانات
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            تصدير CSV
          </button>
        </div>
      </div>
    </div>
  );
}
