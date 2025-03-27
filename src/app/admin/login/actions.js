"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

// Admin credentials - in production, these would come from a database
const adminUser = {
  id: "admin-1",
  username: "admin",
  // Use a strong password in production
  password: "Admin@123",
  role: "admin",
};

const adminLoginSchema = z.object({
  username: z.string().min(1, { message: "اسم المستخدم مطلوب" }).trim(),
  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب أن تكون على الأقل 6 أحرف" })
    .trim(),
});

export async function adminLogin(prevState, formData) {
  const result = adminLoginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { username, password } = result.data;

  if (username !== adminUser.username || password !== adminUser.password) {
    return {
      errors: {
        username: ["اسم المستخدم أو كلمة المرور غير صحيحة"],
      },
    };
  }

  // Create admin session
  await createSession(adminUser.id, adminUser.role);

  // Redirect to admin dashboard
  redirect("/admin");
}

export async function adminLogout() {
  await deleteSession();
  redirect("/admin/login");
}
