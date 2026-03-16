"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import VisitorCounter from "@/components/VisitorCounter";
import ClientProvider from "@/components/ClientProvider";

export default function HomePage() {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/occasions")
      .then((res) => res.json())
      .then((data) => {
        // فلترة المناسبات اللي لسه ما انتهتش
        const now = new Date();
        const active = data.filter(
          (o) => o.isActive && new Date(o.endDate) >= now
        );
        setOccasions(active);
      })
      .catch((err) => console.error("Error fetching occasions:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ClientProvider>
      <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
        <VisitorCounter />
        <Image
          src="/Najran-Municipality.svg"
          alt="Logo"
          width={400}
          height={200}
          className="w-[200px] sm:w-[300px] md:w-[400px] h-auto mb-5"
          priority
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
          خدمة تصميم كروت الدعوات الرسمية
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl mt-2 text-center px-4">
          والأعياد الدينية والرسمية للمملكة العربية السعودية
        </h2>

        {loading ? (
          <div className="mt-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#84923a]"></div>
          </div>
        ) : occasions.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-lg">
              لا توجد مناسبات نشطة حالياً
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-5 w-full max-w-4xl px-4 flex-wrap">
            {occasions.map((occasion) => (
              <Link
                key={occasion.id}
                href={`/occasion/${occasion.slug}`}
                className="cssbuttons-io link2 w-full sm:w-auto text-white text-xl sm:text-2xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg flex flex-row gap-2 justify-center items-center transition-all hover:scale-105"
              >
                <Image
                  src="/icon.svg"
                  alt={occasion.name}
                  width={40}
                  height={40}
                  className="w-8 sm:w-10 h-8 sm:h-10"
                />
                <span>{occasion.name}</span>
                {occasion.templateCount > 0 && (
                  <span className="bg-white/20 text-sm rounded-full px-2 py-0.5">
                    {occasion.templateCount} قالب
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* رابط صفحة الدعوات الثابتة */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4 w-full max-w-4xl px-4 flex-wrap">
          <Link
            href="/invitation"
            className="cssbuttons-io link2 w-full sm:w-auto text-white text-xl sm:text-2xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg flex flex-row gap-2 justify-center items-center transition-all hover:scale-105 opacity-90"
          >
            <Image
              src="/icon.svg"
              alt="بطاقة دعوة"
              width={40}
              height={40}
              className="w-8 sm:w-10 h-8 sm:h-10"
            />
            <span>بطاقة دعوة</span>
          </Link>
        </div>

        <footer className="fixed bottom-0 h-10 text-center w-full bg-white/80 backdrop-blur-sm py-2">
          <p className="text-sm sm:text-base">
            جميع الحقوق محفوظة – أمانة منطقة نجران © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </ClientProvider>
  );
}
