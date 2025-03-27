"use client";
import { useState, useEffect } from "react";
import { useDownload } from "../lib/downloadContext";

export default function DownloadCounter() {
  console.log("DownloadCounter component rendering");
  const [isClient, setIsClient] = useState(false);
  const [count, setCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  // Get the download count and functions from context
  const { downloadCount, getDownloadsToday } = useDownload();
  console.log(
    "In DownloadCounter: downloadCount from context =",
    downloadCount
  );

  // Handle client-side rendering to avoid hydration mismatch
  useEffect(() => {
    console.log("DownloadCounter useEffect running");
    setIsClient(true);

    // Set the count from context
    setCount(downloadCount);

    // Get today's downloads
    const today = getDownloadsToday();
    setTodayCount(today);

    console.log(
      "DownloadCounter state updated: count =",
      downloadCount,
      "today =",
      today
    );
  }, [downloadCount, getDownloadsToday]);

  // Only render on client side to prevent hydration mismatch
  if (!isClient) {
    console.log("DownloadCounter not rendered yet (server-side)");
    return null;
  }

  console.log("DownloadCounter rendered with count:", count);
  return (
    <div className="absolute top-16 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md">
      <div className="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-[#83923b] mr-2"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm font-semibold text-gray-700 text-left flex items-center">
          عدد التحميلات: <span className="text-[#83923b] mx-1">{count}</span>
        </p>
      </div>
      <div className="flex items-center pl-7">
        <p className="text-xs text-gray-600 text-left">
          اليوم:{" "}
          <span className="font-medium text-[#83923b]">{todayCount}</span>
        </p>
      </div>
    </div>
  );
}
