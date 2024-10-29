import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-svh">
      <Image
        src="/Najran-Municipality.svg"
        alt="Logo"
        width={400}
        height={200}
        className="mb-5"
        priority
      />
      <h1 className="text-4xl font-bold">خدمة تصميم كروت الدعوات الرسمية </h1>
      <h2 className="text-2xl mt-2">
        والأعياد الدينية والرسمية للمملكة العربية السعودية
      </h2>
      <div className="flex flex-row justify-center items-center gap-3 mt-5">
        <Link
          type="button"
          href="/invitation"
          className="cssbuttons-io link1  text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg flex flex-row gap-2 justify-center items-center"
        >
          <img src="/icon.svg" alt="holiday" className="w-10 h-10" />
          <span>الدعوات الرسمية</span>
        </Link>
        <Link
          href="/holiday"
          className="cssbuttons-io link2  text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg flex flex-row gap-2 justify-center items-center"
        >
          <img src="/icon.svg" alt="holiday" className="w-10 h-10" />
          <span> الأعياد والمناسبات</span>
        </Link>
      </div>
      <footer className="fixed bottom-0 h-10">
        <p>جميع الحقوق محفوظة – أمانة منطقة نجران © 2024</p>
      </footer>
    </div>
  );
}
