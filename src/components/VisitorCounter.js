"use client";
import { useState, useEffect } from "react";
import { useVisitor } from "../lib/visitorContext";

export default function VisitorCounter() {
  const [isClient, setIsClient] = useState(false);
  const [count, setCount] = useState(0);

  // Try to get the visitor count from context
  let visitorCount = 0;
  try {
    const context = useVisitor();
    visitorCount = context.visitorCount;
  } catch (error) {
    // Handle gracefully if context is not available
  }

  // Handle client-side rendering to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);

    // If we couldn't get the count from context, try from localStorage
    if (visitorCount === 0 && typeof window !== "undefined") {
      try {
        const storedCount = parseInt(
          localStorage.getItem("visitorCount") || "0"
        );
        setCount(storedCount);
      } catch (e) {
        // Ignore errors
      }
    } else {
      setCount(visitorCount);
    }
  }, [visitorCount]);

  // Only render on client side to prevent hydration mismatch
  if (!isClient) return null;

  return (
    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
      <p className="text-sm font-semibold text-gray-700 text-left">
        عدد الزوار: {count}
      </p>
    </div>
  );
}
