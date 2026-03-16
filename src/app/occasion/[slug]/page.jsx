"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Form from "@/components/form/Form";
import NextImage from "next/image";
import VisitorCounter from "@/components/VisitorCounter";
import DownloadCounter from "@/components/DownloadCounter";
import MilestoneNotification from "@/components/MilestoneNotification";
import SocialShareButtons from "@/components/SocialShareButtons";
import FeedbackForm from "@/components/FeedbackForm";
import ImageSlider from "@/components/card/ImageSlider";
import { useDownload } from "@/lib/downloadContext";

export default function OccasionPage() {
  const { slug } = useParams();
  const [occasion, setOccasion] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState("");
  const [position, setPosition] = useState("أمانة منطقة نجران");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [shareImageData, setShareImageData] = useState(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  const elementRef = useRef(null);
  const canvasRef = useRef(null);
  const { incrementDownloadCount, saveFeedback } = useDownload();

  // جلب بيانات المناسبة
  useEffect(() => {
    fetch(`/api/occasions/by-slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("المناسبة غير موجودة");
        return res.json();
      })
      .then((data) => {
        setOccasion(data);
        setTemplates(data.templates || []);
        if (data.templates?.length > 0) {
          setSelectedTemplate(data.templates[0]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setPageLoading(false));
  }, [slug]);

  // رسم الكانفاس
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || !selectedTemplate) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsLoading(true);

    const img = new Image();
    img.crossOrigin = "Anonymous";

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    img.onload = () => {
      clearTimeout(loadingTimeout);

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      setCanvasDimensions({ width: img.naturalWidth, height: img.naturalHeight });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // رسم النص بالإحداثيات من الداتابيز
      if (data || position) {
        const t = selectedTemplate;

        // الاسم
        if (data) {
          ctx.font = `bold ${t.fontSize}px ${t.fontFamily}`;
          ctx.fillStyle = t.fontColor;
          ctx.textAlign = "center";
          const nameX = canvas.width / 2 + t.nameX;
          const nameY = (canvas.height + t.nameY) / 2;
          ctx.fillText(data, nameX, nameY);
        }

        // الإدارة
        if (position) {
          ctx.font = `${t.deptFontSize || Math.round(t.fontSize * 0.7)}px ${t.deptFontFamily || t.fontFamily}`;
          ctx.fillStyle = t.deptFontColor || "#8f5c22";
          ctx.textAlign = "center";
          const deptX = canvas.width / 2 + t.deptX;
          const deptY = (canvas.height + t.deptY) / 2;
          ctx.fillText(position, deptX, deptY);
        }
      }

      // حفظ صورة المشاركة
      if (canvasRef.current) {
        setShareImageData(canvasRef.current.toDataURL("image/png"));
      }

      setIsLoading(false);
    };

    img.onerror = () => {
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    };

    img.src = selectedTemplate.imagePath;
  }, [selectedTemplate, data, position]);

  // إعادة رسم الكانفاس عند تغيير البيانات
  useEffect(() => {
    if (selectedTemplate) {
      renderCanvas();
    }
  }, [selectedTemplate, data, position, renderCanvas]);

  // إخفاء إشعار النجاح
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
        setShowSocialShare(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  // إخفاء المشاركة وعرض التقييم
  useEffect(() => {
    if (showSocialShare) {
      const timer = setTimeout(() => {
        setShowSocialShare(false);
        setShowFeedbackForm(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showSocialShare]);

  // اختيار قالب
  const handleCardSelection = (index) => {
    setIsLoading(true);
    setSelectedTemplate(templates[index]);
    setSelectedIndex(index);
  };

  // تحميل البطاقة
  const handleDownload = (event) => {
    event.preventDefault();
    if (!canvasRef.current || isLoading) return;

    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = `امانة-نجران-${occasion?.name || "بطاقة"}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    if (typeof incrementDownloadCount === "function") {
      incrementDownloadCount(selectedTemplate?.id, data, position);
    }

    setShowSuccessNotification(true);
  };

  const handleFeedbackSubmit = (feedbackData) => {
    return saveFeedback(feedbackData).then(() => {
      setShowFeedbackForm(false);
    });
  };

  // حالة التحميل
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#84923a]"></div>
      </div>
    );
  }

  // خطأ
  if (error || !occasion) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-xl text-gray-600">{error || "المناسبة غير موجودة"}</p>
        <Link href="/" className="text-[#83923b] underline text-lg">العودة للرئيسية</Link>
      </div>
    );
  }

  // لا قوالب
  if (templates.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-xl text-gray-600">لا توجد قوالب متاحة لهذه المناسبة</p>
        <Link href="/" className="text-[#83923b] underline text-lg">العودة للرئيسية</Link>
      </div>
    );
  }

  const images = templates.map((t) => t.imagePath);

  const steps = [
    { id: 1, title: "اختر قالب البطاقة" },
    { id: 2, title: "اكتب اسمك هنا" },
    { id: 3, title: "عاين البطاقة وحملها" },
  ];

  return (
    <div className="lg:max-w-4xl mx-auto pt-20 pb-16">
      <VisitorCounter />
      <DownloadCounter />
      <MilestoneNotification />

      {/* إشعار النجاح */}
      {showSuccessNotification && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md animate-fade-in flex items-center z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>تم تحميل البطاقة بنجاح!</span>
        </div>
      )}

      <SocialShareButtons show={showSocialShare} onClose={() => setShowSocialShare(false)} imageDataUrl={shareImageData} />
      <FeedbackForm show={showFeedbackForm} onClose={() => setShowFeedbackForm(false)} onSubmit={handleFeedbackSubmit} />

      <div className="relative">
        <NextImage src="/Najran-Municipality.svg" alt="logo" width="200" height="100" className="mx-auto mb-3" />
        <h1 className="text-2xl w-3/4 lg:w-1/2 mx-auto text-center">{occasion.name}</h1>

        <div className="text-center mt-7">
          {steps.map((step) => (
            <div key={step.id} className="mb-5">
              <div className="flex flex-col justify-center items-center gap-2 flex-wrap">
                <span className="rounded-full bg-[#84923a] shadow text-[40px] font-bold h-[88px] w-[88px] mx-auto block text-center leading-[88px] text-white">
                  {step.id}
                </span>
                <div className="mb-8 block text-[1.5rem]">
                  <h2 className="mb-2 block text-[1.5rem]">{step.title}</h2>
                </div>
                {step.id === 1 ? (
                  <div className="flex justify-center items-center w-full">
                    <ImageSlider
                      images={images}
                      onSelect={handleCardSelection}
                      selectedIndex={selectedIndex}
                    />
                  </div>
                ) : step.id === 2 ? (
                  <Form
                    type="holiday"
                    data={data}
                    position={position}
                    pClick={(event) => setPosition(event.target.value)}
                    dClick={(event) => setData(event.target.value)}
                  />
                ) : (
                  <div
                    ref={elementRef}
                    className="flex justify-center items-center w-[80%] mx-auto lg:w-full mb-10 relative"
                  >
                    <canvas
                      ref={canvasRef}
                      width={canvasDimensions.width}
                      height={canvasDimensions.height}
                      className="text-center max-w-full h-auto border rounded-lg shadow-md"
                      style={{
                        maxHeight: "80vh",
                        maxWidth: "100%",
                        objectFit: "contain",
                        display: isLoading ? "none" : "block",
                        margin: "0 auto",
                      }}
                    />
                    {isLoading && (
                      <div className="flex flex-col items-center justify-center h-96 w-full absolute top-0 left-0 right-0 bottom-0">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#84923a] mb-4"></div>
                        <p className="text-gray-600">جاري تحميل البطاقة...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-3 w-[80%] mx-auto mb-7">
            <a
              href="#"
              onClick={handleDownload}
              className="bg-[#83923b] text-white px-4 py-4 rounded-lg block w-full transition-all duration-300 hover:bg-[#6b7830] hover:scale-105 flex-1"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                تحميل البطاقة
              </div>
            </a>
            <button
              onClick={() => setShowSocialShare(true)}
              className="bg-blue-600 text-white px-4 py-4 rounded-lg block w-full md:w-auto transition-all duration-300 hover:bg-blue-700 hover:scale-105"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                مشاركة
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
