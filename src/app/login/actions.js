"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";

export async function login(prevState, formData) {
  await createSession();

  redirect("/invitation");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
