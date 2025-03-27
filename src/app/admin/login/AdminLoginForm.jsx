"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminLogin } from "./actions";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function AdminLoginForm() {
  const [state, loginAction] = useActionState(adminLogin, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center max-w-md w-full mx-auto bg-white shadow-lg rounded-lg p-10 border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        تسجيل دخول المسؤول
      </h1>
      <div className="w-full mb-6 flex justify-center">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md text-sm w-full">
          منطقة محظورة - الدخول مقتصر على المشرفين فقط
        </div>
      </div>
      <form action={loginAction} className="space-y-4 w-full">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 text-right"
          >
            اسم المستخدم
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="اسم المستخدم"
            className="w-full bg-gray-50 text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-md px-3 py-2"
            autoComplete="username"
          />
          {state?.errors?.username && (
            <p className="text-red-500 text-sm">{state.errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 text-right"
          >
            كلمة المرور
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="w-full bg-gray-50 text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-md px-3 py-2"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {state?.errors?.password && (
            <p className="text-red-500 text-sm">{state.errors.password}</p>
          )}
        </div>
        <AdminSubmitButton />
      </form>
    </div>
  );
}

function AdminSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors duration-300 mt-2"
    >
      <span>{pending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</span>
    </button>
  );
}
