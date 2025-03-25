"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Modal from "./Modal.js";
import VisitorCounter from "../../components/VisitorCounter";
import ClientProvider from "../../components/ClientProvider";

export default function HomePage({ session }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ClientProvider>
      <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message="هذه الخدمه غير متاحه حاليا , يرجى المحاولة في وقت لاحق"
        />
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
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-5 w-full max-w-4xl px-4">
          <Link
            type="button"
            href="/invitation"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            className="cssbuttons-io link1 w-full sm:w-auto text-white text-xl sm:text-2xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg flex flex-row gap-2 justify-center items-center transition-all hover:scale-105"
          >
            <img
              src="/icon.svg"
              alt="holiday"
              className="w-8 sm:w-10 h-8 sm:h-10"
            />
            <span>الدعوات الرسمية</span>
          </Link>
          <Link
            href="/holiday"
            className="cssbuttons-io link2 w-full sm:w-auto text-white text-xl sm:text-2xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg flex flex-row gap-2 justify-center items-center transition-all hover:scale-105"
          >
            <img
              src="/icon.svg"
              alt="holiday"
              className="w-8 sm:w-10 h-8 sm:h-10"
            />
            <span>الأعياد والمناسبات</span>
          </Link>
        </div>
        <footer className="fixed bottom-0 h-10 text-center w-full bg-white/80 backdrop-blur-sm py-2">
          <p className="text-sm sm:text-base">
            جميع الحقوق محفوظة – أمانة منطقة نجران © 2024
          </p>
        </footer>
      </div>
    </ClientProvider>
  );
}
