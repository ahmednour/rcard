import React from "react";

const GeoDistributionPlaceholder = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium mb-4">التوزيع الجغرافي للتحميلات</h3>

      <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mb-4 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
          />
        </svg>

        <h4 className="text-base font-medium text-gray-700 mb-2">
          التوزيع الجغرافي قادم قريباً
        </h4>
        <p className="text-sm text-gray-500 max-w-lg">
          سيتم إضافة خريطة تفاعلية توضح المناطق الجغرافية التي يتم منها تحميل
          البطاقات. هذه الميزة ستساعد في فهم انتشار استخدام البطاقات ومناطق
          الاهتمام.
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-xl">
          {[
            "المملكة العربية السعودية",
            "الإمارات العربية المتحدة",
            "مصر",
            "الكويت",
          ].map((country, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded border border-gray-200 shadow-sm"
            >
              <div className="text-xs text-gray-500">متوقع</div>
              <div className="text-sm font-medium">{country}</div>
              <div className="text-xs mt-1 text-gray-400">
                البيانات غير متوفرة
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-800 max-w-lg">
          <h4 className="font-medium mb-2">معلومات إضافية</h4>
          <p>
            لتفعيل هذه الميزة، سيتطلب الأمر تحديث البرنامج لجمع بيانات الموقع
            الجغرافي بطريقة مجهولة المصدر تحترم خصوصية المستخدم، أو الاستعانة
            بخدمة تتبع الزوار مثل Google Analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeoDistributionPlaceholder;
