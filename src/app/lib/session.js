import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey =
  process.env.SESSION_SECRET || "fallback_secret_key_for_development";
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId, role = "user") {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expiresAt });

  // Use the cookies function with await
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
    sameSite: "lax",
  });
}

export async function deleteSession() {
  // Use the cookies function with await
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }
    return await decrypt(sessionCookie.value);
  } catch (error) {
    console.log("Failed to get session:", error.message);
    return null;
  }
}

export async function encrypt(payload) {
  try {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey);
  } catch (error) {
    console.error("Encryption error:", error.message);
    throw new Error("Failed to create session token");
  }
}

export async function decrypt(session = "") {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session:", error.message);
    return null;
  }
}
