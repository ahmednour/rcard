"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Create the context with a default value
const VisitorContext = createContext({
  visitorCount: 0,
  setVisitorCount: () => {},
});

export function VisitorProvider({ children }) {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Client-side only code
    if (typeof window === "undefined") return;

    try {
      // Get the current count from localStorage
      const currentCount = parseInt(
        localStorage.getItem("visitorCount") || "0"
      );

      // Only increment the count once per session
      if (!sessionStorage.getItem("countedThisSession")) {
        const newCount = currentCount + 1;
        localStorage.setItem("visitorCount", newCount.toString());
        sessionStorage.setItem("countedThisSession", "true");
        setVisitorCount(newCount);
      } else {
        // Just use the existing count
        setVisitorCount(currentCount);
      }
    } catch (error) {
      console.error("Error accessing storage:", error);
      // Use default value if there's an error
    }
  }, []); // Run once when component mounts

  const contextValue = { visitorCount, setVisitorCount };

  return (
    <VisitorContext.Provider value={contextValue}>
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
