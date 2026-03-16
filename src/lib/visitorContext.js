"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const VisitorContext = createContext({
  visitorCount: 0,
});

export function VisitorProvider({ children }) {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // جلب عدد الزوار من الـ API
    fetch("/api/visitors/stats")
      .then((res) => res.json())
      .then((data) => setVisitorCount(data.total || 0))
      .catch((err) => console.error("Error fetching visitor stats:", err));

    // تسجيل زيارة جديدة مرة واحدة لكل جلسة
    if (!sessionStorage.getItem("countedThisSession")) {
      fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: window.location.pathname }),
      })
        .then(() => {
          sessionStorage.setItem("countedThisSession", "true");
          setVisitorCount((prev) => prev + 1);
        })
        .catch((err) => console.error("Error recording visitor:", err));
    }
  }, []);

  const value = useMemo(() => ({ visitorCount }), [visitorCount]);

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitor() {
  const context = useContext(VisitorContext);
  if (context === undefined) {
    throw new Error("useVisitor must be used within a VisitorProvider");
  }
  return context;
}
