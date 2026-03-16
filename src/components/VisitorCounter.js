"use client";
import { useVisitor } from "@/lib/visitorContext";

export default function VisitorCounter() {
  const { visitorCount } = useVisitor();

  return (
    <div className="absolute top-2 sm:top-2 left-2 sm:left-4 bg-white/80 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1 sm:py-2 shadow-md z-10 text-xs sm:text-sm" suppressHydrationWarning>
      <p className="font-semibold text-gray-700 text-left">
        عدد الزوار: {visitorCount}
      </p>
    </div>
  );
}
