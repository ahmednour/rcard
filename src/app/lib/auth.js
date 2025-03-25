import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function getAuthSession() {
  // Make sure we await cookies() to avoid synchronous access
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  return await decrypt(sessionCookie.value);
}
