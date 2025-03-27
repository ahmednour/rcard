"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FeedbackForm({ show, onClose, onSubmit }) {
  const [isClient, setIsClient] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit({ rating, feedback })
      .then(() => {
        setRating(0);
        setFeedback("");
        onClose();
      })
      .finally(() => setIsSubmitting(false));
  };

  if (!isClient || !show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 md:mx-auto text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            كيف كانت تجربتك؟
          </h2>
          <p className="text-gray-600 text-sm">
            نرجو منك تقييم تجربة استخدام خدمة تصميم بطاقات المعايدة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-10 w-10 ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          <div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#83923b] focus:border-transparent"
              placeholder="شاركنا ملاحظاتك أو اقتراحاتك (اختياري)"
              rows={3}
            ></textarea>
          </div>

          <div className="mt-4 text-center">
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg mr-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال"}
              </button>
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-5 rounded-lg"
                onClick={onClose}
              >
                إغلاق
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <Link href="/help" className="text-indigo-600 hover:underline">
                لديك أسئلة حول التعليقات والخصوصية؟
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
