"use client";
import { VisitorProvider } from "../lib/visitorContext";

export default function ClientProvider({ children }) {
  return <VisitorProvider>{children}</VisitorProvider>;
}
