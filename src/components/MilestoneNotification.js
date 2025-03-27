"use client";
import { useState, useEffect } from "react";
import { useDownload } from "@/lib/downloadContext";

export default function MilestoneNotification() {
  const [isClient, setIsClient] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [milestone, setMilestone] = useState(null);

  // Get download context functions
  let checkMilestone = () => null;
  let acknowledgeCurrentMilestone = () => {};
  let downloadCount = 0;

  try {
    const context = useDownload();
    checkMilestone = context.checkMilestone;
    acknowledgeCurrentMilestone = context.acknowledgeCurrentMilestone;
    downloadCount = context.downloadCount;
  } catch (error) {
    // Handle gracefully
  }

  // Check for milestone on first load and when download count changes
  useEffect(() => {
    setIsClient(true);

    // Only check when client-side and not already showing notification
    if (isClient && !showNotification) {
      const currentMilestone = checkMilestone();
      if (currentMilestone) {
        setMilestone(currentMilestone);
        setShowNotification(true);
      }
    }
  }, [isClient, showNotification, checkMilestone, downloadCount]);

  const handleClose = () => {
    acknowledgeCurrentMilestone();
    setShowNotification(false);
  };

  if (!isClient || !showNotification || !milestone) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 md:mx-auto animate-fade-in text-center">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-[#83923b] mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800">تهانينا!</h2>
        </div>

        <p className="text-lg mb-6">
          لقد وصلنا إلى
          <span className="font-bold text-[#83923b] mx-1">{milestone}</span>
          بطاقة تم تحميلها!
        </p>

        <p className="text-sm text-gray-600 mb-6">
          شكراً لكم على استخدام خدمة بطاقات المعايدة. نتمنى أن تكون البطاقات قد
          أسعدتكم ومن حولكم.
        </p>

        <button
          onClick={handleClose}
          className="bg-[#83923b] text-white px-6 py-2 rounded-lg transition-colors hover:bg-[#6b7830]"
        >
          حسناً
        </button>
      </div>
    </div>
  );
}
