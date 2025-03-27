"use client";
import ClientProvider from "../../components/ClientProvider";

export default function CardsLayout({ children }) {
  return <ClientProvider>{children}</ClientProvider>;
}
