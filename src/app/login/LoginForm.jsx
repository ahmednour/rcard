"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center max-w-md w-full mx-auto bg-slate-100 shadow-lg rounded-lg p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-emerald-950">
        سجل الدخول للخدمة
      </h1>
      <form action={loginAction} className="space-y-4 w-full">
        <div className="space-y-2">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full bg-white bg-opacity-95 text-gray-900 placeholder-gray-900 border-gray-950 border-opacity-95 focus:border-white focus:ring-white h-12 rounded px-3 py-2"
          />
          {state?.errors?.email && (
            <p className="text-red-500 text-sm">{state.errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="........"
              className="w-full bg-white bg-opacity-95 text-gray-900 placeholder-gray-900 border-gray-950 border-opacity-95 focus:border-white focus:ring-white h-12 rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
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
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full cssbuttons-io link2 text-2xl text-white py-3 rounded "
    >
      <span>{pending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</span>
    </button>
  );
}
