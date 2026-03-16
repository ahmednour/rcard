"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const MILESTONES = [10, 50, 100, 500, 1000];

const DownloadContext = createContext({
  downloadCount: 0,
  incrementDownloadCount: () => {},
  saveFeedback: () => {},
  checkMilestone: () => null,
  acknowledgeCurrentMilestone: () => {},
});

// Helper functions for device detection
const detectDeviceType = () => {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent || "";
  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    if (/ipad/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) return "جهاز لوحي";
    return "جوال";
  }
  return "حاسوب";
};

const detectBrowser = () => {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent;
  if (ua.match(/edg/i)) return "Edge";
  if (ua.match(/chrome|chromium|crios/i)) return "Chrome";
  if (ua.match(/firefox|fxios/i)) return "Firefox";
  if (ua.match(/safari/i)) return "Safari";
  if (ua.match(/opr\//i)) return "Opera";
  return "غير معروف";
};

const detectOS = () => {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent;
  if (ua.match(/windows/i)) return "Windows";
  if (ua.match(/mac os x/i)) return "macOS";
  if (ua.match(/android/i)) return "Android";
  if (ua.match(/iphone|ipad|ipod/i)) return "iOS";
  if (ua.match(/linux/i)) return "Linux";
  return "غير معروف";
};

export function DownloadProvider({ children }) {
  const [downloadCount, setDownloadCount] = useState(0);
  const [acknowledgedMilestones, setAcknowledgedMilestones] = useState([]);

  // جلب عدد التحميلات من الـ API عند التحميل
  useEffect(() => {
    fetch("/api/downloads/stats")
      .then((res) => res.json())
      .then((data) => {
        setDownloadCount(data.total || 0);
      })
      .catch((err) => console.error("Error fetching download stats:", err));

    // جلب الـ milestones المعترف بها من sessionStorage (مؤقت بالجلسة)
    try {
      const milestones = JSON.parse(sessionStorage.getItem("acknowledgedMilestones") || "[]");
      setAcknowledgedMilestones(milestones);
    } catch {}
  }, []);

  // تسجيل تحميل جديد
  const incrementDownloadCount = useCallback((templateId, userName, deptName) => {
    const device = detectDeviceType();
    const browser = detectBrowser();
    const os = detectOS();

    fetch("/api/downloads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, userName, deptName, device, browser, os }),
    })
      .then((res) => res.json())
      .then(() => {
        setDownloadCount((prev) => prev + 1);
      })
      .catch((err) => console.error("Error recording download:", err));
  }, []);

  // حفظ التقييم
  const saveFeedback = useCallback((feedbackData) => {
    return fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: feedbackData.rating,
        comment: feedbackData.feedback || "",
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.error("Error saving feedback:", err));
  }, []);

  // فحص الـ milestones
  const checkMilestone = useCallback(() => {
    for (const milestone of MILESTONES) {
      if (downloadCount >= milestone && !acknowledgedMilestones.includes(milestone)) {
        return milestone;
      }
    }
    return null;
  }, [downloadCount, acknowledgedMilestones]);

  const acknowledgeCurrentMilestone = useCallback(() => {
    const milestone = checkMilestone();
    if (milestone) {
      const newList = [...acknowledgedMilestones, milestone];
      setAcknowledgedMilestones(newList);
      try {
        sessionStorage.setItem("acknowledgedMilestones", JSON.stringify(newList));
      } catch {}
    }
  }, [checkMilestone, acknowledgedMilestones]);

  const contextValue = {
    downloadCount,
    incrementDownloadCount,
    saveFeedback,
    checkMilestone,
    acknowledgeCurrentMilestone,
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
