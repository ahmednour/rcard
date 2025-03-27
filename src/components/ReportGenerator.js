import React from "react";
import { useDownload } from "../lib/downloadContext";

const ReportGenerator = () => {
  const { downloadHistory, feedbackData } = useDownload();

  const generateDownloadCSV = () => {
    // Define CSV headers
    const headers = ["Timestamp", "Browser", "OS", "Device"];

    // Map download data to CSV rows
    const data = downloadHistory.map((item) => [
      new Date(item.timestamp).toLocaleString(),
      item.browser || "Unknown",
      item.os || "Unknown",
      item.device || "Unknown",
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    return csvContent;
  };

  const generateFeedbackCSV = () => {
    // Define CSV headers
    const headers = ["Timestamp", "Rating", "Feedback"];

    // Map feedback data to CSV rows
    const data = feedbackData.map((item) => [
      new Date(item.timestamp).toLocaleString(),
      item.rating,
      // Escape quotes and commas in feedback text
      item.feedback ? `"${item.feedback.replace(/"/g, '""')}"` : "",
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    return csvContent;
  };

  const downloadCSV = (csvContent, fileName) => {
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Set link properties
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";

    // Add link to document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadReport = () => {
    const csvContent = generateDownloadCSV();
    downloadCSV(
      csvContent,
      `download-report-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const handleFeedbackReport = () => {
    const csvContent = generateFeedbackCSV();
    downloadCSV(
      csvContent,
      `feedback-report-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">تصدير التقارير</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h4 className="text-base font-medium mb-2">تقرير التحميلات</h4>
          <p className="text-sm text-gray-600 mb-3">
            تصدير بيانات التحميلات بتنسيق CSV
          </p>
          <button
            onClick={handleDownloadReport}
            disabled={downloadHistory.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تصدير التقرير
            <span className="mr-1">({downloadHistory.length})</span>
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="text-base font-medium mb-2">تقرير التقييمات</h4>
          <p className="text-sm text-gray-600 mb-3">
            تصدير بيانات التقييمات والتعليقات بتنسيق CSV
          </p>
          <button
            onClick={handleFeedbackReport}
            disabled={feedbackData.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تصدير التقرير
            <span className="mr-1">({feedbackData.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
