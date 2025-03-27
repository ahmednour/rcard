"use client";
import { useState, useEffect } from "react";
import { useDownload } from "../lib/downloadContext";

// The same milestone values from downloadContext
const MILESTONES = [10, 50, 100, 500, 1000];

export default function MilestoneProgressBar() {
  const [isClient, setIsClient] = useState(false);
  const [nextMilestone, setNextMilestone] = useState(null);
  const [prevMilestone, setPrevMilestone] = useState(0);
  const [progress, setProgress] = useState(0);

  // Get download count from context
  let downloadCount = 0;

  try {
    const context = useDownload();
    downloadCount = context.downloadCount;
  } catch (error) {
    // Handle gracefully
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate progress towards next milestone
  useEffect(() => {
    if (!isClient) return;

    // Find the next milestone
    const nextMilestoneValue =
      MILESTONES.find((m) => m > downloadCount) ||
      MILESTONES[MILESTONES.length - 1] * 2;
    setNextMilestone(nextMilestoneValue);

    // Find the previous milestone
    const prevMilestoneValue =
      MILESTONES.filter((m) => m <= downloadCount).pop() || 0;
    setPrevMilestone(prevMilestoneValue);

    // Calculate progress percentage
    const range = nextMilestoneValue - prevMilestoneValue;
    const achieved = downloadCount - prevMilestoneValue;
    const percentage = Math.floor((achieved / range) * 100);
    setProgress(percentage);
  }, [isClient, downloadCount]);

  if (!isClient || !nextMilestone) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md mb-4">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{prevMilestone} تحميل</span>
        <span>{nextMilestone} تحميل</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-[#83923b] h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-1 text-xs text-center text-gray-600">
        <span className="font-semibold">{downloadCount}</span> تحميل حتى الآن (
        {progress}% نحو الهدف التالي)
      </div>
    </div>
  );
}
