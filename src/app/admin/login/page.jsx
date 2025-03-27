"use client";

import { AdminLoginForm } from "./AdminLoginForm";
import Link from "next/link";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden h-svh bg-slate-50">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 py-2 px-4 rounded-lg text-sm flex items-center shadow-sm transition-all duration-300"
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
      <AdminLoginForm />
    </div>
  );
}
