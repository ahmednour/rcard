"use client";
import { useState, useEffect } from "react";
import { useDownload } from "../../lib/downloadContext";
import { useVisitor } from "../../lib/visitorContext";
import ClientProvider from "../../components/ClientProvider";
import ReportGenerator from "../../components/ReportGenerator";
import DashboardSummary from "../../components/DashboardSummary";
import DownloadTimeAnalysis from "../../components/DownloadTimeAnalysis";
import UserRetentionAnalysis from "../../components/UserRetentionAnalysis";
import GeoDistributionPlaceholder from "../../components/GeoDistributionPlaceholder";
import DownloadPrediction from "../../components/DownloadPrediction";
import Link from "next/link";
import { adminLogout } from "./login/actions";

// Milestone values - should match the ones in downloadContext.js
const MILESTONES = [10, 25, 50, 100, 250, 500, 1000];

// Wrapper component for admin dashboard
export default function AdminPage() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="flex space-x-4 rtl:space-x-reverse">
          <Link
            href="/status"
            className="bg-green-100 text-green-700 hover:bg-green-200 py-2 px-4 rounded-lg text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            حالة النظام
          </Link>
          <Link
            href="/help"
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 py-2 px-4 rounded-lg text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            صفحة المساعدة
          </Link>
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            العودة للرئيسية
          </Link>
        </div>
        <form action={adminLogout} className="inline">
          <button
            type="submit"
            className="bg-red-100 text-red-700 hover:bg-red-200 py-2 px-4 rounded-lg text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            تسجيل الخروج
          </button>
        </form>
      </div>
      <ClientProvider>
        <StatsDisplay />
      </ClientProvider>
    </div>
  );
}

// Wrapper component to safely use hooks
function StatsDisplay({ onResetDownloads }) {
  // Always call hooks here, whether they'll succeed or not
  let downloadCount = 0;
  let downloadHistory = [];
  let feedbackData = [];
  let resetDownloadCount = () => {};
  let getDownloadsToday = () => 0;
  let getDownloadsThisWeek = () => 0;
  let getDownloadsThisMonth = () => 0;
  let getAverageRating = () => 0;
  let visitorCount = 0;

  try {
    const downloadContext = useDownload();
    downloadCount = downloadContext.downloadCount;
    downloadHistory = downloadContext.downloadHistory || [];
    feedbackData = downloadContext.feedbackData || [];
    resetDownloadCount = downloadContext.resetDownloadCount;
    getDownloadsToday = downloadContext.getDownloadsToday;
    getDownloadsThisWeek = downloadContext.getDownloadsThisWeek;
    getDownloadsThisMonth = downloadContext.getDownloadsThisMonth;
    getAverageRating = downloadContext.getAverageRating;
  } catch (error) {
    // Context not available
  }

  try {
    const visitorContext = useVisitor();
    visitorCount = visitorContext.visitorCount;
  } catch (error) {
    // Context not available
  }

  const handleResetDownloads = () => {
    if (window.confirm("هل أنت متأكد أنك تريد إعادة تعيين عدد التحميلات؟")) {
      resetDownloadCount();
      if (onResetDownloads) {
        onResetDownloads();
      }
    }
  };

  // Calculate download statistics
  const todayDownloads = getDownloadsToday();
  const weekDownloads = getDownloadsThisWeek();
  const monthDownloads = getDownloadsThisMonth();

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate downloads by day for the last 7 days
  const downloadsByDay = {};
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayName = date
      .toLocaleString("ar-SA", { weekday: "short" })
      .split("،")[0];
    const dateStr = date.toISOString().split("T")[0];
    downloadsByDay[dayName] = 0;

    // Count downloads for this day
    downloadHistory.forEach((item) => {
      const downloadDate = new Date(item.timestamp);
      if (downloadDate.toISOString().split("T")[0] === dateStr) {
        downloadsByDay[dayName]++;
      }
    });
  }

  // Get device statistics
  const getDeviceStats = () => {
    const stats = { device: {}, browser: {}, os: {} };

    downloadHistory.forEach((item) => {
      // Count devices
      if (item.device) {
        stats.device[item.device] = (stats.device[item.device] || 0) + 1;
      }

      // Count browsers
      if (item.browser) {
        stats.browser[item.browser] = (stats.browser[item.browser] || 0) + 1;
      }

      // Count operating systems
      if (item.os) {
        stats.os[item.os] = (stats.os[item.os] || 0) + 1;
      }
    });

    return stats;
  };

  const deviceStats = getDeviceStats();

  // Format chart data
  const chartData = Object.entries(downloadsByDay).map(([day, count]) => ({
    day,
    count,
  }));

  // Calculate additional metrics
  const conversionRate =
    visitorCount > 0 ? Math.round((downloadCount / visitorCount) * 100) : 0;
  const todayConversionRate =
    todayDownloads > 0 ? Math.round((todayDownloads / visitorCount) * 100) : 0;
  const averageRating = getAverageRating();
  const feedbackCount = feedbackData.length;
  const feedbackRate =
    downloadCount > 0 ? Math.round((feedbackCount / downloadCount) * 100) : 0;

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    feedbackData.forEach((feedback) => {
      distribution[feedback.rating] = (distribution[feedback.rating] || 0) + 1;
    });

    return Object.entries(distribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage:
        feedbackCount > 0 ? Math.round((count / feedbackCount) * 100) : 0,
    }));
  };

  const ratingDistribution = getRatingDistribution();

  // Format feedback date for display
  const formatFeedbackDate = (timestamp) => {
    return formatDate(timestamp);
  };

  return (
    <div>
      <DashboardSummary />

      {downloadHistory.length > 0 && (
        <>
          <DashboardSummary
            downloadHistory={downloadHistory}
            feedbackData={feedbackData}
          />
          <UserRetentionAnalysis />
          <DownloadTimeAnalysis />
          <DownloadPrediction />
          <GeoDistributionPlaceholder />
        </>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">إحصائيات الموقع</h2>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-medium">عدد التحميلات</div>
            <div className="bg-gray-100 px-3 py-1 rounded-lg text-lg font-semibold">
              {downloadCount}
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-medium">عدد الزوار</div>
            <div className="bg-gray-100 px-3 py-1 rounded-lg text-lg font-semibold">
              {visitorCount}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">معدل التحويل</h3>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-800 mb-1">
                  معدل التحويل الإجمالي
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {conversionRate}%
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  نسبة الزوار الذين قاموا بتحميل البطاقة
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">إحصائيات التحميل</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-sm font-medium text-amber-800 mb-1">اليوم</p>
              <p className="text-2xl font-bold text-amber-600">
                {todayDownloads}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm font-medium text-purple-800 mb-1">
                هذا الأسبوع
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {weekDownloads}
              </p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg text-center">
              <p className="text-sm font-medium text-cyan-800 mb-1">
                هذا الشهر
              </p>
              <p className="text-2xl font-bold text-cyan-600">
                {monthDownloads}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">
            التحميلات حسب اليوم (آخر 7 أيام)
          </h3>
          <div className="h-40 flex items-end justify-between p-2 border rounded-lg">
            {chartData.map(({ day, count }) => (
              <div key={day} className="flex flex-col items-center">
                <div
                  className="bg-[#83923b] w-8 rounded-t-md"
                  style={{
                    height: `${
                      count
                        ? Math.max(
                            10,
                            (count /
                              Math.max(...Object.values(downloadsByDay))) *
                              100
                          )
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

        {downloadHistory.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">آخر 5 تحميلات</h3>
            <div className="overflow-auto max-h-40 border rounded-lg p-2">
              <ul className="space-y-1">
                {downloadHistory
                  .slice(-5)
                  .reverse()
                  .map((item, index) => (
                    <li
                      key={index}
                      className="text-sm py-1 border-b last:border-0"
                    >
                      <div className="flex flex-col">
                        <div className="text-gray-900">
                          {formatDate(item.timestamp)}
                        </div>
                        {item.device && item.browser && item.os && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.device} • {item.browser} • {item.os}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {downloadHistory.length > 0 &&
          Object.keys(deviceStats.device).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">إحصائيات الأجهزة</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                {/* Device Types */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-base font-medium mb-3">نوع الجهاز</h4>
                  {Object.entries(deviceStats.device)
                    .sort(([, a], [, b]) => b - a)
                    .map(([device, count]) => {
                      const percentage = Math.round(
                        (count / downloadHistory.length) * 100
                      );
                      return (
                        <div key={device} className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{device}</span>
                            <span className="text-xs text-gray-500">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Browsers */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-base font-medium mb-3">المتصفح</h4>
                  {Object.entries(deviceStats.browser)
                    .sort(([, a], [, b]) => b - a)
                    .map(([browser, count]) => {
                      const percentage = Math.round(
                        (count / downloadHistory.length) * 100
                      );
                      return (
                        <div key={browser} className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{browser}</span>
                            <span className="text-xs text-gray-500">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Operating Systems */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-base font-medium mb-3">نظام التشغيل</h4>
                  {Object.entries(deviceStats.os)
                    .sort(([, a], [, b]) => b - a)
                    .map(([os, count]) => {
                      const percentage = Math.round(
                        (count / downloadHistory.length) * 100
                      );
                      return (
                        <div key={os} className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{os}</span>
                            <span className="text-xs text-gray-500">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">تكوين المعالم الهامة</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">
              يتم إظهار إشعارات عند بلوغ أرقام التحميل التالية:
            </p>
            <div className="flex flex-wrap gap-2">
              {MILESTONES.map((milestone) => (
                <span
                  key={milestone}
                  className="bg-[#83923b] text-white text-xs px-3 py-1 rounded-full"
                >
                  {milestone}
                </span>
              ))}
            </div>
          </div>
        </div>

        {feedbackData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">تقييمات المستخدمين</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-indigo-800 mb-1">
                      متوسط التقييم
                    </h4>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold text-indigo-700">
                        {averageRating}
                      </p>
                      <div className="flex ml-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${
                              star <= Math.round(averageRating)
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
                    <p className="text-xs text-gray-600 mt-1">
                      من {feedbackCount} تقييم
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-pink-800 mb-1">
                      معدل التقييم
                    </h4>
                    <p className="text-2xl font-bold text-pink-700">
                      {feedbackRate}%
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      نسبة التحميلات التي تم تقييمها
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-base font-medium mb-3">توزيع التقييمات</h4>
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="mb-2 flex items-center">
                  <div className="flex items-center w-12">
                    <span className="text-sm mr-1">{rating}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm">
                    <span className="text-gray-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {feedbackData.some((item) => item.feedback) && (
              <div>
                <h4 className="text-base font-medium mb-3">آخر التعليقات</h4>
                <div className="overflow-auto max-h-40 border rounded-lg p-2">
                  <ul className="space-y-1">
                    {feedbackData
                      .filter((item) => item.feedback)
                      .slice(-5)
                      .reverse()
                      .map((item, index) => (
                        <li
                          key={index}
                          className="text-sm py-2 border-b last:border-0"
                        >
                          <div className="flex items-center mb-1">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-3 w-3 ${
                                    star <= item.rating
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
                            <span className="text-xs text-gray-500">
                              {formatFeedbackDate(item.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700">{item.feedback}</p>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <ReportGenerator />

        <div className="border-t pt-6">
          <button
            onClick={handleResetDownloads}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            إعادة تعيين عدد التحميلات
          </button>
        </div>
      </div>
    </div>
  );
}
