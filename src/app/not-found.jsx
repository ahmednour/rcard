import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center" dir="rtl">
      <Image
        src="/Najran-Municipality.svg"
        alt="أمانة منطقة نجران"
        width={200}
        height={100}
        className="mb-8 opacity-60"
      />

      <div className="relative mb-6">
        <h1 className="text-[120px] sm:text-[160px] font-bold text-primary opacity-15 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
        الصفحة غير موجودة
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها إلى عنوان آخر.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-all duration-300 hover:scale-105 font-medium"
        >
          العودة للرئيسية
        </Link>
        <Link
          href="/help"
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium"
        >
          المساعدة
        </Link>
      </div>

      <footer className="fixed bottom-0 h-10 text-center w-full bg-white/80 backdrop-blur-sm py-2">
        <p className="text-sm text-gray-500">
          جميع الحقوق محفوظة – أمانة منطقة نجران © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
