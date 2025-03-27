"use client";
import { useState } from "react";
import Link from "next/link";

export default function InstructionsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          دليل استخدام نظام التحميلات والتقييمات
        </h1>
        <Link
          href="/admin"
          className="bg-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
        >
          العودة للوحة التحكم
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "overview"
                ? "bg-gray-100 border-b-2 border-[#83923b]"
                : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            نظرة عامة
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "features"
                ? "bg-gray-100 border-b-2 border-[#83923b]"
                : ""
            }`}
            onClick={() => setActiveTab("features")}
          >
            الميزات
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "metrics"
                ? "bg-gray-100 border-b-2 border-[#83923b]"
                : ""
            }`}
            onClick={() => setActiveTab("metrics")}
          >
            المقاييس والإحصائيات
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "admin"
                ? "bg-gray-100 border-b-2 border-[#83923b]"
                : ""
            }`}
            onClick={() => setActiveTab("admin")}
          >
            لوحة التحكم
          </button>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                نظرة عامة على النظام
              </h2>
              <p className="mb-4">
                نظام التحميلات والتقييمات هو حل متكامل يمكّن المستخدمين من تحميل
                البطاقات الإلكترونية بسهولة، مع تتبع إحصائيات التحميل وجمع
                التقييمات وتحسين تجربة المستخدم.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">
                المكونات الرئيسية:
              </h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>
                  <strong>نظام عد التحميلات:</strong> يتتبع عدد مرات تحميل
                  البطاقات ويخزنها محليًا.
                </li>
                <li>
                  <strong>إشعارات المعالم:</strong> يعرض إشعارات تهنئة عند
                  الوصول إلى أرقام تحميل محددة.
                </li>
                <li>
                  <strong>شريط تقدم المعالم:</strong> يوضح التقدم نحو المعلم
                  التالي.
                </li>
                <li>
                  <strong>نظام التقييمات:</strong> يسمح للمستخدمين بتقييم
                  تجربتهم بعد التحميل.
                </li>
                <li>
                  <strong>مشاركة اجتماعية:</strong> يتيح للمستخدمين مشاركة
                  البطاقات على منصات التواصل الاجتماعي.
                </li>
                <li>
                  <strong>لوحة تحكم المسؤول:</strong> توفر رؤى وإحصائيات شاملة.
                </li>
              </ul>

              <h3 className="text-lg font-medium mt-6 mb-3">تخزين البيانات:</h3>
              <p className="mb-4">
                يستخدم النظام التخزين المحلي (localStorage) لتخزين بيانات
                التحميل والتقييمات، مما يعني:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>البيانات مخزنة محليًا على جهاز المستخدم.</li>
                <li>لا يوجد خادم خلفي (backend) لتخزين البيانات.</li>
                <li>البيانات تبقى حتى يتم مسح التخزين المحلي للمتصفح.</li>
                <li>يمكن تصدير البيانات كملفات CSV للمعالجة الخارجية.</li>
              </ul>
            </div>
          )}

          {activeTab === "features" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">ميزات النظام</h2>

              <div className="space-y-6">
                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">نظام التحميلات</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>تتبع عدد مرات تحميل البطاقات</li>
                    <li>تسجيل معلومات الجهاز والمتصفح ونظام التشغيل</li>
                    <li>تسجيل تاريخ ووقت كل تحميل</li>
                    <li>عرض إشعار نجاح التحميل</li>
                    <li>تخزين البيانات محليًا باستخدام التخزين المحلي</li>
                  </ul>
                </div>

                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">نظام المعالم</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      معالم قابلة للتكوين (10، 25، 50، 100، 250، 500، 1000)
                    </li>
                    <li>إشعارات تهنئة عند الوصول إلى كل معلم</li>
                    <li>شريط تقدم مرئي نحو المعلم التالي</li>
                    <li>عرض العدد المتبقي للوصول إلى المعلم التالي</li>
                  </ul>
                </div>

                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">نظام التقييمات</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>نظام تقييم بالنجوم من 1 إلى 5</li>
                    <li>مساحة لتعليقات المستخدمين</li>
                    <li>يظهر تلقائيًا بعد التحميل</li>
                    <li>تخزين التقييمات محليًا</li>
                    <li>حساب متوسط التقييمات</li>
                  </ul>
                </div>

                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">
                    المشاركة الاجتماعية
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>أزرار مشاركة لمنصات التواصل الاجتماعي الشائعة</li>
                    <li>دعم واتساب، تويتر، فيسبوك</li>
                    <li>تخصيص نص المشاركة</li>
                    <li>تحسين تجربة المستخدم بعد التحميل</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">تصدير البيانات</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>تصدير بيانات التحميل كملف CSV</li>
                    <li>تصدير بيانات التقييمات كملف CSV</li>
                    <li>تنسيق البيانات للتحليل الخارجي</li>
                    <li>نسخ احتياطي للبيانات</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "metrics" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                المقاييس والإحصائيات
              </h2>

              <div className="space-y-6">
                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">إحصائيات التحميل</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>إجمالي التحميلات:</strong> العدد الإجمالي لعمليات
                      التحميل
                    </li>
                    <li>
                      <strong>تحميلات اليوم:</strong> عدد التحميلات في اليوم
                      الحالي
                    </li>
                    <li>
                      <strong>تحميلات الأسبوع:</strong> عدد التحميلات في الأسبوع
                      الحالي
                    </li>
                    <li>
                      <strong>تحميلات الشهر:</strong> عدد التحميلات في الشهر
                      الحالي
                    </li>
                    <li>
                      <strong>التوزيع اليومي:</strong> رسم بياني للتحميلات على
                      مدار آخر 7 أيام
                    </li>
                    <li>
                      <strong>آخر التحميلات:</strong> قائمة بآخر 5 عمليات تحميل
                      مع الوقت والتاريخ
                    </li>
                  </ul>
                </div>

                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">إحصائيات الزوار</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>إجمالي الزوار:</strong> العدد الإجمالي للزوار
                    </li>
                    <li>
                      <strong>معدل التحويل:</strong> نسبة الزوار الذين قاموا
                      بالتحميل
                    </li>
                    <li>
                      <strong>معدل التحويل اليومي:</strong> نسبة التحويل في
                      اليوم الحالي
                    </li>
                    <li>
                      <strong>النمو اليومي:</strong> نسبة التغير في التحميلات
                      مقارنة بالأمس
                    </li>
                    <li>
                      <strong>النمو الأسبوعي:</strong> نسبة التغير في التحميلات
                      مقارنة بالأسبوع الماضي
                    </li>
                  </ul>
                </div>

                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">
                    إحصائيات التقييمات
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>متوسط التقييم:</strong> متوسط جميع التقييمات
                      المقدمة
                    </li>
                    <li>
                      <strong>عدد التقييمات:</strong> العدد الإجمالي للتقييمات
                    </li>
                    <li>
                      <strong>معدل التقييم:</strong> نسبة المستخدمين الذين قدموا
                      تقييمًا بعد التحميل
                    </li>
                    <li>
                      <strong>توزيع التقييمات:</strong> رسم بياني يوضح توزيع
                      التقييمات من 1 إلى 5 نجوم
                    </li>
                    <li>
                      <strong>آخر التعليقات:</strong> قائمة بأحدث 5 تعليقات
                      مقدمة مع التقييمات
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">إحصائيات الأجهزة</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>توزيع الأجهزة:</strong> نسبة التحميلات حسب نوع
                      الجهاز (جوال، حاسوب، لوحي)
                    </li>
                    <li>
                      <strong>توزيع المتصفحات:</strong> التحميلات مصنفة حسب نوع
                      المتصفح
                    </li>
                    <li>
                      <strong>توزيع أنظمة التشغيل:</strong> التحميلات مصنفة حسب
                      نظام التشغيل
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "admin" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">دليل لوحة التحكم</h2>

              <div className="space-y-6">
                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">لوحة الإحصائيات</h3>
                  <p className="mb-3">
                    تعرض ملخصًا للإحصائيات الرئيسية، وتتكون من:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>بطاقات ملخص تعرض الأرقام الرئيسية</li>
                    <li>رسوم بيانية للاتجاهات</li>
                    <li>مؤشرات النمو مقارنة بالفترات السابقة</li>
                    <li>توزيع الأجهزة</li>
                  </ul>
                </div>

                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">
                    المعلومات التفصيلية
                  </h3>
                  <p className="mb-3">
                    عرض تفصيلي لجميع البيانات المتاحة، ويشمل:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>أعداد التحميلات والزوار</li>
                    <li>معدلات التحويل</li>
                    <li>إحصائيات يومية وأسبوعية وشهرية</li>
                    <li>آخر التحميلات</li>
                    <li>تكوين المعالم الهامة</li>
                    <li>إحصائيات التقييمات</li>
                    <li>تعليقات المستخدمين</li>
                  </ul>
                </div>

                <div className="border-b pb-5">
                  <h3 className="text-lg font-medium mb-3">تصدير البيانات</h3>
                  <p className="mb-3">
                    خيارات تصدير البيانات للاستخدام الخارجي:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>تصدير تقرير التحميلات بتنسيق CSV</li>
                    <li>تصدير تقرير التقييمات بتنسيق CSV</li>
                    <li>يتضمن التقرير معلومات مفصلة عن كل سجل</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    إعادة تعيين البيانات
                  </h3>
                  <p className="mb-3">خيارات إدارة البيانات:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>إعادة تعيين عداد التحميلات</li>
                    <li>يتم طلب تأكيد قبل إعادة التعيين</li>
                    <li>تأثر البيانات عند إعادة التعيين:</li>
                    <ul className="list-disc list-inside mr-5 mt-1 space-y-1">
                      <li>يتم إعادة تعيين عداد التحميلات إلى صفر</li>
                      <li>يتم مسح سجل التحميلات</li>
                      <li>لا يتم مسح بيانات التقييمات</li>
                    </ul>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
