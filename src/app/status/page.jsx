"use client";

import React, { useState, useEffect } from "react";
import { useDownload } from "../../../lib/downloadContext";
import Link from "next/link";

export default function StatusPage() {
  const { downloadCount, downloadHistory, feedbackData } = useDownload();
  const [systemStatus, setSystemStatus] = useState({
    localStorage: false,
    contextLoaded: false,
    browserSupport: false,
  });

  // Verify system status
  useEffect(() => {
    // Check localStorage availability
    const checkLocalStorage = () => {
      try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
        return true;
      } catch (e) {
        return false;
      }
    };

    // Check browser features
    const checkBrowserSupport = () => {
      const features = {
        localStorage: typeof localStorage !== "undefined",
        json: typeof JSON !== "undefined",
        querySelector: typeof document.querySelector === "function",
        eventListener: typeof window.addEventListener === "function",
      };

      return Object.values(features).every((feature) => feature);
    };

    setSystemStatus({
      localStorage: checkLocalStorage(),
      contextLoaded: downloadHistory !== undefined,
      browserSupport: checkBrowserSupport(),
    });
  }, [downloadHistory]);

  // Calculate system health percentage
  const systemHealth =
    (Object.values(systemStatus).filter(Boolean).length /
      Object.values(systemStatus).length) *
    100;

  // Calculate statistics
  const stats = {
    totalDownloads: downloadCount,
    uniqueDevices: downloadHistory
      ? new Set(
          downloadHistory.map(
            (item) =>
              `${item.browser || ""}-${item.device || ""}-${item.os || ""}`
          )
        ).size
      : 0,
    feedbackCount: feedbackData ? feedbackData.length : 0,
    avgRating:
      feedbackData && feedbackData.length > 0
        ? (
            feedbackData.reduce((sum, item) => sum + item.rating, 0) /
            feedbackData.length
          ).toFixed(1)
        : "غير متاح",
    lastDownload:
      downloadHistory && downloadHistory.length > 0
        ? new Date(
            downloadHistory[downloadHistory.length - 1].timestamp
          ).toLocaleString("ar-SA")
        : "لا يوجد",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">حالة نظام التتبع</h1>
        <div className="flex space-x-3 rtl:space-x-reverse">
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
            المساعدة
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
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">صحة النظام</h2>
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              systemHealth === 100
                ? "bg-green-100 text-green-800"
                : systemHealth >= 66
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {systemHealth === 100
              ? "يعمل بشكل طبيعي"
              : systemHealth >= 66
              ? "يعمل بشكل جزئي"
              : "توجد مشاكل"}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className={`h-2.5 rounded-full ${
              systemHealth === 100
                ? "bg-green-500"
                : systemHealth >= 66
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${systemHealth}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">التخزين المحلي</span>
              {systemStatus.localStorage ? (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {systemStatus.localStorage
                ? "متصفحك يدعم التخزين المحلي بشكل كامل."
                : "المتصفح لا يدعم التخزين المحلي أو أنه معطل. بعض الميزات قد لا تعمل."}
            </p>
          </div>

          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">سياق التتبع</span>
              {systemStatus.contextLoaded ? (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {systemStatus.contextLoaded
                ? "سياق التتبع يعمل بشكل صحيح وتم تحميله بنجاح."
                : "هناك مشكلة في تحميل سياق التتبع. حاول تحديث الصفحة."}
            </p>
          </div>

          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">دعم المتصفح</span>
              {systemStatus.browserSupport ? (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {systemStatus.browserSupport
                ? "متصفحك يدعم جميع الميزات المطلوبة."
                : "متصفحك لا يدعم بعض الميزات المطلوبة. يرجى تحديث المتصفح."}
            </p>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">إحصائيات النظام</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-blue-700 font-medium mb-1">إجمالي التحميلات</h3>
            <p className="text-2xl font-bold text-blue-800">
              {stats.totalDownloads}
            </p>
            <p className="text-xs text-blue-600 mt-1">منذ بدء التشغيل</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-purple-700 font-medium mb-1">
              الأجهزة الفريدة
            </h3>
            <p className="text-2xl font-bold text-purple-800">
              {stats.uniqueDevices}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              تقدير تقريبي بناء على بيانات الجهاز
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-green-700 font-medium mb-1">عدد التقييمات</h3>
            <p className="text-2xl font-bold text-green-800">
              {stats.feedbackCount}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {stats.avgRating !== "غير متاح"
                ? `متوسط التقييم: ${stats.avgRating}/5`
                : "لم يتم تسجيل تقييمات بعد"}
            </p>
          </div>

          <div className="col-span-1 md:col-span-3 bg-gray-50 rounded-lg p-4">
            <h3 className="text-gray-700 font-medium mb-1">آخر تحميل</h3>
            <p className="text-gray-800">{stats.lastDownload}</p>
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium mb-4">إجراءات النظام</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin"
            className="border border-gray-200 hover:bg-gray-50 transition-colors rounded-lg p-4 flex items-start"
          >
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">لوحة التحكم</h3>
              <p className="text-sm text-gray-600">
                عرض إحصائيات مفصلة وتقارير عن التحميلات والتقييمات
              </p>
            </div>
          </Link>

          <Link
            href="/help"
            className="border border-gray-200 hover:bg-gray-50 transition-colors rounded-lg p-4 flex items-start"
          >
            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
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
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">مركز المساعدة</h3>
              <p className="text-sm text-gray-600">
                الحصول على إجابات للأسئلة الشائعة وطرق استخدام النظام
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600 mt-0.5 ml-2"
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
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                ملاحظة هامة
              </h3>
              <p className="text-xs text-yellow-700">
                جميع البيانات المجمعة تُخزن محليًا في متصفحك فقط. إذا قمت بمسح
                بيانات المتصفح أو استخدام جهاز آخر، ستبدأ الإحصائيات من جديد.
                البيانات مجهولة المصدر ولا تحتوي على أي معلومات تعريفية.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
