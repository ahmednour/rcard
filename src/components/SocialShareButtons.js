"use client";
import { useState, useEffect } from "react";

export default function SocialShareButtons({ show, onClose }) {
  const [isClient, setIsClient] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  if (!isClient || !show) return null;

  // Share content
  const title = "بطاقة المعايدة الخاصة بي";
  const description = "صممت بطاقة المعايدة الخاصة بي، شاركوني الفرحة!";

  // Share URLs
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    title + " - " + description + " " + url
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    description
  )}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title + " - " + description)}`;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 bg-white shadow-lg rounded-t-xl p-4 animate-fade-in z-40 ${
        show ? "block" : "hidden"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">مشاركة البطاقة</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-center space-x-6 rtl:space-x-reverse">
        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mb-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <span className="text-xs">واتساب</span>
        </a>

        {/* Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white mb-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </div>
          <span className="text-xs">تويتر</span>
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white mb-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <span className="text-xs">فيسبوك</span>
        </a>

        {/* Telegram */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0Zm4.58 7.837c.046-.047 3.259 1.219 3.259 1.219s.46 1.55.92 3.1c.046.183.137.778.228 1.373.091.55.183 1.373.183 1.373.046.183.046.32-.046.412-.091.183-.274.275-.502.32a78.038 78.038 0 0 1-.73.185c-.228.045-.502.045-.73-.092-.594-.32-3.9-2.52-4.127-2.657-.046-.045-.091-.091-.091-.137 0-.046 0-.092.045-.137.046-.092 1.097-1.051 2.24-2.056 1.143-1.006 2.01-1.83 2.148-1.967.228-.229.137-.32-.137-.229-.73.229-3.214 2.01-4.081 2.566a.273.273 0 0 1-.228.045c-.183-.045-1.281-.412-2.01-.64-.731-.23-1.189-.366-1.143-.778.046-.183.274-.366.685-.595.87-.411 4.4-1.83 7.705-3.168.32-.138.594-.184.777-.138Z" />
            </svg>
          </div>
          <span className="text-xs">تليجرام</span>
        </a>
      </div>
    </div>
  );
}
