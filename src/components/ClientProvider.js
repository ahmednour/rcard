"use client";
import { VisitorProvider } from "../lib/visitorContext";
import { DownloadProvider } from "../lib/downloadContext";

export default function ClientProvider({ children }) {
  return (
    <VisitorProvider>
      <DownloadProvider>{children}</DownloadProvider>
    </VisitorProvider>
  );
}
