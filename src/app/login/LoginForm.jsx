"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";
import { useState } from "react";
import { motion } from "framer-motion";
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function LoginForm() {
  const [state, formAction] = useFormState(login);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-md z-10"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-emerald-950">
        سجل الدخول للخدمة
      </h1>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300 border-white border-opacity-30 focus:border-white focus:ring-white h-12 rounded px-3 py-2"
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
              className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300 border-white border-opacity-30 focus:border-white focus:ring-white h-12 rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"
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
    </motion.div>
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
