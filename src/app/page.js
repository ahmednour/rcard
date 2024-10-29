"use client";
import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";
import { redirect } from "next/dist/server/api-utils";
export default function Home() {
  const [state, setState] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://najranapp:8078/CardsAPI/Permissions/IsAuthorized"
        );
        const data = await response.json();
        console.log(data);
        setState(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
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
        <button
          type="button"
          className="cssbuttons-io link1  text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg flex flex-row gap-2 justify-center items-center"
          onClick={() => {
            if (state) {
              redirect("/invitation");
            } else {
              alert("لايوجد لديك صلاحيه للدخول");
            }
          }}
        >
          <img src="/icon.svg" alt="holiday" className="w-10 h-10" />
          <span>الدعوات الرسمية</span>
        </button>
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
