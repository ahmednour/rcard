"use client";
import { useState, useEffect } from "react";
import { useDownload } from "@/lib/downloadContext";

export default function DownloadCounter() {
  const [todayCount, setTodayCount] = useState(0);
  const { downloadCount } = useDownload();

  // جلب تحميلات اليوم مرة واحدة عند التحميل
  useEffect(() => {
    fetch("/api/downloads/stats")
      .then((res) => res.json())
      .then((data) => setTodayCount(data.today || 0))
      .catch(() => {});
  }, []);

  return (
    <div className="absolute top-2 sm:top-2 right-2 sm:right-4 bg-white/80 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-2 sm:py-3 shadow-md z-10" suppressHydrationWarning>
      <div className="flex items-center mb-1 sm:mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-1 sm:mr-2"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-xs sm:text-sm font-semibold text-gray-700 text-left flex items-center">
          عدد التحميلات: <span className="text-primary mx-1">{downloadCount}</span>
        </p>
      </div>
      <div className="flex items-center pl-3 sm:pl-7">
        <p className="text-[10px] sm:text-xs text-gray-600 text-left">
          اليوم:{" "}
          <span className="font-medium text-primary">{todayCount}</span>
        </p>
      </div>
    </div>
  );
}
