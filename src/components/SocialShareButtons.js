"use client";
import { useState, useEffect } from "react";

export default function SocialShareButtons({ show, onClose, imageDataUrl }) {
  const [isClient, setIsClient] = useState(false);
  const [url, setUrl] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

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

  // Function to handle image sharing
  const shareImage = async (platform) => {
    try {
      // Show success message
      const showShareSuccess = () => {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      };

      // If we have an image to share and the Web Share API is supported
      if (imageDataUrl && navigator.share) {
        const blob = await fetch(imageDataUrl).then((r) => r.blob());
        const file = new File([blob], "بطاقة-المعايدة.png", {
          type: "image/png",
        });

        await navigator
          .share({
            title,
            text: description,
            url,
            files: [file],
          })
          .then(() => {
            showShareSuccess();
          })
          .catch((error) => {
            // Fallback to URL sharing
            window.open(getPlatformUrl(platform), "_blank");
            showShareSuccess();
          });
        return;
      }

      // Fallback to URL sharing
      window.open(getPlatformUrl(platform), "_blank");
      showShareSuccess();
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback to URL sharing
      window.open(getPlatformUrl(platform), "_blank");
    }
  };

  // Get platform-specific share URL
  const getPlatformUrl = (platform) => {
    switch (platform) {
      case "whatsapp":
        return `https://wa.me/?text=${encodeURIComponent(
          title + " - " + description + " " + url
        )}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          description
        )}&url=${encodeURIComponent(url)}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
      case "telegram":
        return `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title + " - " + description)}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
      case "email":
        return `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(description + " " + url)}`;
      default:
        return "";
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-30 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 inset-x-0 bg-white shadow-lg rounded-t-2xl p-6 transition-transform duration-300 ease-in-out z-40 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            مشاركة البطاقة
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
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

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
          {/* WhatsApp */}
          <button
            onClick={() => shareImage("whatsapp")}
            className="flex flex-col items-center group"
          >
            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white mb-2 transform group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">واتساب</span>
          </button>

          {/* Twitter */}
          <button
            onClick={() => shareImage("twitter")}
            className="flex flex-col items-center group"
          >
            <div className="w-14 h-14 rounded-full bg-blue-400 flex items-center justify-center text-white mb-2 transform group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">تويتر</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => shareImage("facebook")}
            className="flex flex-col items-center group"
          >
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white mb-2 transform group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">فيسبوك</span>
          </button>

          {/* Telegram */}
          <button
            onClick={() => shareImage("telegram")}
            className="flex flex-col items-center group"
          >
            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2 transform group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0Zm4.58 7.837c.046-.047 3.259 1.219 3.259 1.219s.46 1.55.92 3.1c.046.183.137.778.228 1.373.091.55.183 1.373.183 1.373.046.183.046.32-.046.412-.091.183-.274.275-.502.32a78.038 78.038 0 0 1-.73.185c-.228.045-.502.045-.73-.092-.594-.32-3.9-2.52-4.127-2.657-.046-.045-.091-.091-.091-.137 0-.046 0-.092.045-.137.046-.092 1.097-1.051 2.24-2.056 1.143-1.006 2.01-1.83 2.148-1.967.228-.229.137-.32-.137-.229-.73.229-3.214 2.01-4.081 2.566a.273.273 0 0 1-.228.045c-.183-.045-1.281-.412-2.01-.64-.731-.23-1.189-.366-1.143-.778.046-.183.274-.366.685-.595.87-.411 4.4-1.83 7.705-3.168.32-.138.594-.184.777-.138Z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">تليجرام</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => shareImage("linkedin")}
            className="flex flex-col items-center group"
          >
            <div className="w-14 h-14 rounded-full bg-blue-700 flex items-center justify-center text-white mb-2 transform group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">لينكد إن</span>
          </button>

          {/* Email */}
          <button
            onClick={() => shareImage("email")}
            className="flex flex-col items-center group"
          >
            <div className="w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center text-white mb-2 transform group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-600">البريد</span>
          </button>
        </div>

        {/* Success Message */}
        <div
          className={`fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg transition-opacity duration-300 ${
            shareSuccess ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>تمت المشاركة بنجاح!</span>
          </div>
        </div>
      </div>
    </>
  );
}
