"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// Rate limiting: track login attempts in memory
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier) {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    loginAttempts.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  // Reset if window has passed
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const waitMinutes = Math.ceil((WINDOW_MS - (now - record.firstAttempt)) / 60000);
    return { allowed: false, remaining: 0, waitMinutes };
  }

  record.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

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

  // Rate limiting check
  const rateLimit = checkRateLimit(username);
  if (!rateLimit.allowed) {
    return {
      errors: {
        username: [
          `تم تجاوز عدد المحاولات المسموحة. يرجى الانتظار ${rateLimit.waitMinutes} دقيقة`,
        ],
      },
    };
  }

  // Find admin in database
  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return {
      errors: {
        username: ["اسم المستخدم أو كلمة المرور غير صحيحة"],
      },
    };
  }

  // Compare password with bcrypt hash
  const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatch) {
    return {
      errors: {
        username: ["اسم المستخدم أو كلمة المرور غير صحيحة"],
      },
    };
  }

  // Clear rate limit on successful login
  loginAttempts.delete(username);

  // Create admin session
  await createSession(admin.id, "admin");

  redirect("/admin");
}

export async function adminLogout() {
  await deleteSession();
  redirect("/admin/login");
}
