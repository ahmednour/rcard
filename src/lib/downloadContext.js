"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Milestones configuration
const MILESTONES = [10, 50, 100, 500, 1000];

// Create the context with a default value
const DownloadContext = createContext({
  downloadCount: 0,
  downloadHistory: [],
  feedbackData: [],
  incrementDownloadCount: () => {},
  resetDownloadCount: () => {},
  getDownloadsToday: () => 0,
  getDownloadsThisWeek: () => 0,
  getDownloadsThisMonth: () => 0,
  checkMilestone: () => null,
  acknowledgeCurrentMilestone: () => {},
  saveFeedback: () => {},
  getAverageRating: () => 0,
});

// Helper function to detect user's device type
const detectDeviceType = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check if mobile
  if (
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )
  ) {
    // Differentiate between tablet and mobile
    if (
      /ipad/i.test(userAgent) ||
      (/android/i.test(userAgent) && !/mobile/i.test(userAgent)) ||
      (window.innerWidth > 767 && window.innerHeight > 767)
    ) {
      return "جهاز لوحي";
    }
    return "جوال";
  }

  return "حاسوب";
};

// Helper function to detect browser
const detectBrowser = () => {
  const userAgent = navigator.userAgent;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    return "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    return "Firefox";
  } else if (userAgent.match(/safari/i)) {
    return "Safari";
  } else if (userAgent.match(/opr\//i)) {
    return "Opera";
  } else if (userAgent.match(/edg/i)) {
    return "Edge";
  } else if (userAgent.match(/msie|trident/i)) {
    return "Internet Explorer";
  }

  return "غير معروف";
};

// Helper function to detect OS
const detectOS = () => {
  const userAgent = navigator.userAgent;

  if (userAgent.match(/windows nt 10.0|windows 10/i)) {
    return "Windows 10";
  } else if (userAgent.match(/windows nt 6.3|windows 8.1/i)) {
    return "Windows 8.1";
  } else if (userAgent.match(/windows nt 6.2|windows 8/i)) {
    return "Windows 8";
  } else if (userAgent.match(/windows nt 6.1|windows 7/i)) {
    return "Windows 7";
  } else if (userAgent.match(/mac os x/i)) {
    return "macOS";
  } else if (userAgent.match(/linux/i)) {
    return "Linux";
  } else if (userAgent.match(/android/i)) {
    return "Android";
  } else if (userAgent.match(/iphone|ipad|ipod/i)) {
    return "iOS";
  }

  return "غير معروف";
};

export function DownloadProvider({ children }) {
  console.log("DownloadProvider rendering");
  const [downloadCount, setDownloadCount] = useState(0);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [acknowledgedMilestones, setAcknowledgedMilestones] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);

  // Initialize from localStorage on mount
  useEffect(() => {
    // Client-side only code
    if (typeof window === "undefined") return;

    try {
      console.log("Initializing DownloadProvider...");

      // Get the current count and history from localStorage
      const currentCount = parseInt(
        localStorage.getItem("downloadCount") || "0"
      );
      console.log("Initial download count from localStorage:", currentCount);
      setDownloadCount(currentCount);

      const history = JSON.parse(
        localStorage.getItem("downloadHistory") || "[]"
      );
      setDownloadHistory(history);

      const milestones = JSON.parse(
        localStorage.getItem("acknowledgedMilestones") || "[]"
      );
      setAcknowledgedMilestones(milestones);

      const feedback = JSON.parse(localStorage.getItem("feedbackData") || "[]");
      setFeedbackData(feedback);

      console.log("DownloadProvider initialized successfully");
    } catch (error) {
      console.error("Error accessing storage:", error);
      // Use default values if there's an error
    }
  }, []); // Run once when component mounts

  // The increment function
  const incrementDownloadCount = () => {
    try {
      // Use a functional update to ensure we're using the latest state
      setDownloadCount((prevCount) => {
        if (typeof window === "undefined") return prevCount;

        console.log("Current download count:", prevCount);
        const newCount = prevCount + 1;
        const now = new Date().toISOString();

        // Collect device information
        const deviceInfo = {
          timestamp: now,
          device: detectDeviceType(),
          browser: detectBrowser(),
          os: detectOS(),
        };

        // Directly read from localStorage to get the freshest history data
        let currentHistory = [];
        try {
          currentHistory = JSON.parse(
            localStorage.getItem("downloadHistory") || "[]"
          );
        } catch (e) {
          console.error("Error parsing download history:", e);
        }

        const newHistory = [...currentHistory, deviceInfo];

        // Save to localStorage
        localStorage.setItem("downloadCount", newCount.toString());
        localStorage.setItem("downloadHistory", JSON.stringify(newHistory));

        // Update history state separately to avoid race conditions
        setDownloadHistory(newHistory);

        console.log("New download count:", newCount);
        return newCount;
      });
    } catch (error) {
      console.error("Error updating download count:", error);
    }
  };

  const resetDownloadCount = () => {
    try {
      localStorage.setItem("downloadCount", "0");
      localStorage.setItem("downloadHistory", "[]");
      localStorage.setItem("acknowledgedMilestones", "[]");
      // Don't reset feedback data when resetting counters
      setDownloadCount(0);
      setDownloadHistory([]);
      setAcknowledgedMilestones([]);
    } catch (error) {
      console.error("Error resetting download count:", error);
    }
  };

  // Save user feedback
  const saveFeedback = (feedback) => {
    try {
      const now = new Date().toISOString();
      const newFeedback = {
        ...feedback,
        timestamp: now,
      };
      const updatedFeedback = [...feedbackData, newFeedback];

      localStorage.setItem("feedbackData", JSON.stringify(updatedFeedback));
      setFeedbackData(updatedFeedback);
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  // Get average rating from all feedback
  const getAverageRating = () => {
    if (feedbackData.length === 0) return 0;

    const sum = feedbackData.reduce((total, item) => total + item.rating, 0);
    return Math.round((sum / feedbackData.length) * 10) / 10; // Round to 1 decimal place
  };

  // Check if we've reached a new milestone that hasn't been acknowledged
  const checkMilestone = () => {
    for (const milestone of MILESTONES) {
      if (
        downloadCount >= milestone &&
        !acknowledgedMilestones.includes(milestone)
      ) {
        return milestone;
      }
    }
    return null;
  };

  // Mark the current milestone as acknowledged
  const acknowledgeCurrentMilestone = () => {
    const milestone = checkMilestone();
    if (milestone) {
      const newAcknowledgedMilestones = [...acknowledgedMilestones, milestone];
      setAcknowledgedMilestones(newAcknowledgedMilestones);
      localStorage.setItem(
        "acknowledgedMilestones",
        JSON.stringify(newAcknowledgedMilestones)
      );
    }
  };

  // Helper function to count downloads within a time range
  const countDownloadsInRange = (startDate) => {
    const now = new Date();
    return downloadHistory.filter((item) => {
      const downloadDate = new Date(item.timestamp);
      return downloadDate >= startDate && downloadDate <= now;
    }).length;
  };

  // Get downloads for today
  const getDownloadsToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return countDownloadsInRange(today);
  };

  // Get downloads for this week
  const getDownloadsThisWeek = () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    return countDownloadsInRange(startOfWeek);
  };

  // Get downloads for this month
  const getDownloadsThisMonth = () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // First day of current month
    startOfMonth.setHours(0, 0, 0, 0);
    return countDownloadsInRange(startOfMonth);
  };

  const contextValue = {
    downloadCount,
    downloadHistory,
    feedbackData,
    incrementDownloadCount,
    resetDownloadCount,
    getDownloadsToday,
    getDownloadsThisWeek,
    getDownloadsThisMonth,
    checkMilestone,
    acknowledgeCurrentMilestone,
    saveFeedback,
    getAverageRating,
  };

  return (
    <DownloadContext.Provider value={contextValue}>
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownload() {
  const context = useContext(DownloadContext);

  if (context === undefined) {
    throw new Error("useDownload must be used within a DownloadProvider");
  }

  return context;
}
