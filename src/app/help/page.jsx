"use client";

import React from "react";
import Link from "next/link";
import TrackingSystemHelp from "@/components/TrackingSystemHelp";

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">مركز المساعدة</h1>
        <Link
          href="/"
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm flex items-center"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-medium mb-3">القائمة</h3>
            <nav className="space-y-2">
              <a
                href="#tracking"
                className="block px-3 py-2 text-indigo-600 bg-indigo-50 rounded-md"
              >
                نظام التتبع والتحميل
              </a>
              <a
                href="#cards"
                className="block px-3 py-2 hover:bg-gray-50 rounded-md"
              >
                البطاقات المتاحة
              </a>
              <a
                href="#usage"
                className="block px-3 py-2 hover:bg-gray-50 rounded-md"
              >
                كيفية الاستخدام
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 hover:bg-gray-50 rounded-md"
              >
                التواصل معنا
              </a>
            </nav>
          </div>

          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2 text-indigo-700">
              هل تحتاج لمساعدة إضافية؟
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              يمكنك التواصل معنا مباشرة للحصول على المساعدة أو لإرسال اقتراحاتك
              لتحسين الخدمة.
            </p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm">
              تواصل معنا
            </button>
          </div>
        </div>

        <div className="md:col-span-3">
          <section id="tracking">
            <TrackingSystemHelp />
          </section>

          <section
            id="cards"
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h3 className="text-lg font-medium mb-4">البطاقات المتاحة</h3>
            <p className="text-gray-600 mb-4">
              نقدم مجموعة متنوعة من البطاقات لمختلف المناسبات والاحتفالات. تتميز
              جميع بطاقاتنا بجودة تصميم عالية وإمكانية التخصيص.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="w-full h-24 bg-green-100 rounded-md mb-2 flex items-center justify-center">
                  <span className="text-green-600">بطاقات العيد</span>
                </div>
                <span className="text-sm font-medium">مناسبات الأعياد</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="w-full h-24 bg-blue-100 rounded-md mb-2 flex items-center justify-center">
                  <span className="text-blue-600">بطاقات التهنئة</span>
                </div>
                <span className="text-sm font-medium">للمناسبات السعيدة</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="w-full h-24 bg-yellow-100 rounded-md mb-2 flex items-center justify-center">
                  <span className="text-yellow-600">بطاقات رمضان</span>
                </div>
                <span className="text-sm font-medium">شهر رمضان الكريم</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center"
              >
                تصفح جميع البطاقات
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </section>

          <section
            id="usage"
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h3 className="text-lg font-medium mb-4">كيفية استخدام البطاقات</h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 font-medium">١</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-800">
                    اختر البطاقة المناسبة
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    تصفح مجموعة البطاقات المتاحة واختر النوع المناسب للمناسبة
                    التي تريدها.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 font-medium">٢</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-800">تخصيص البطاقة</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    أضف التفاصيل الشخصية مثل الاسم أو الرسالة الخاصة حسب البطاقة
                    المختارة.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 font-medium">٣</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-800">
                    تحميل وحفظ البطاقة
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    بعد الانتهاء من التخصيص، اضغط على زر التحميل لحفظ البطاقة
                    على جهازك.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 font-medium">٤</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-800">مشاركة البطاقة</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    شارك البطاقة مع أحبائك عبر وسائل التواصل الاجتماعي أو
                    تطبيقات المراسلة.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-500 mt-0.5"
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
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">
                    نصائح إضافية
                  </h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    للحصول على أفضل جودة، ننصح بتحميل البطاقة بتنسيق PNG. إذا
                    كنت ترغب في طباعة البطاقة، فالحجم المناسب هو A5 أو A6.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">التواصل معنا</h3>

            <p className="text-gray-600 mb-6">
              نحن نقدر تواصلك معنا! يمكنك الاتصال بنا لأي استفسارات أو اقتراحات
              أو مشاكل تقنية.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-100 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  البريد الإلكتروني
                </h4>
                <p className="text-sm text-gray-600">
                  support@amana-card.example.com
                </p>
              </div>

              <div className="border border-gray-100 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500 ml-2"
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
                  الدعم الفني
                </h4>
                <p className="text-sm text-gray-600">
                  يتوفر الدعم الفني من الأحد إلى الخميس، من 9 صباحًا حتى 5
                  مساءً.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-800 mb-3">
                تابعنا على وسائل التواصل الاجتماعي
              </h4>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
