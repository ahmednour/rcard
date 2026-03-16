"use client";
import { useState, useEffect } from "react";
import { useVisitor } from "@/lib/visitorContext";

export default function VisitorCounter() {
  const [isClient, setIsClient] = useState(false);
  const { visitorCount } = useVisitor();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute top-2 sm:top-2 left-2 sm:left-4 bg-white/80 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 shadow-md z-10 text-xs sm:text-sm">
      <p className="font-semibold text-gray-700 text-left">
        عدد الزوار: {visitorCount}
      </p>
    </div>
  );
}
