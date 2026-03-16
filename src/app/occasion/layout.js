"use client";
import ClientProvider from "@/components/ClientProvider";

export default function OccasionLayout({ children }) {
  return <ClientProvider>{children}</ClientProvider>;
}
