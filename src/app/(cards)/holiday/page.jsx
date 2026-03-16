"use client";
import { useState, useEffect, useRef, useMemo } from "react";

const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();
import Form from "@/components/form/Form";
import NextImage from "next/image";
import VisitorCounter from "@/components/VisitorCounter";
import DownloadCounter from "@/components/DownloadCounter";
import MilestoneNotification from "@/components/MilestoneNotification";
import SocialShareButtons from "@/components/SocialShareButtons";
import FeedbackForm from "@/components/FeedbackForm";
import ImageSlider from "@/components/card/ImageSlider";
import { useDownload } from "@/lib/downloadContext";

const Holiday = () => {
  const bg1Src = "/bg1.jpg";
  const bg2Src = "/bg2.jpg";
  const bg3Src = "/bg3.jpg";
  const bg4Src = "/bg4.jpg";
  const bg5Src = "/bg5.jpg";
  const logoSrc = "/Najran-Municipality.svg";
  const images = useMemo(() => [bg1Src, bg2Src, bg3Src, bg4Src, bg5Src], []);
  const [data, setData] = useState("");
  const [position, setPosition] = useState("أمانة منطقة نجران");
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [clickedId, setClickedId] = useState(0);
  const [isActive, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const elementRef = useRef(null);
  const canvasRef = useRef(null);
  const { incrementDownloadCount, saveFeedback } = useDownload();
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [shareImageData, setShareImageData] = useState(null);

  // إخفاء إشعار النجاح → عرض المشاركة → عرض التقييم
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
        setShowSocialShare(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  useEffect(() => {
    if (showSocialShare) {
      const timer = setTimeout(() => {
        setShowSocialShare(false);
        setShowFeedbackForm(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showSocialShare]);

  // تحديث أبعاد الكانفاس عند تغيير الصورة
  useEffect(() => {
    if (selectedImage) {
      const img = new Image();
      img.onload = () => {
        setCanvasDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = selectedImage;
    }
  }, [selectedImage]);

  // إعادة رسم الكانفاس عند تغيير البيانات
  useEffect(() => {
    setIsLoading(true);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    renderCanvas();
  }, [selectedImage, data, position, clickedId]);

  // إحداثيات النصوص حسب القالب
  const getTextConfig = (canvasWidth, canvasHeight, templateId) => {
    const offsets = [
      { x: 0, y: 950 },   // القالب 1
      { x: 0, y: 50 },    // القالب 2
      { x: 260, y: 700 }, // القالب 3
      { x: 260, y: 700 }, // القالب 4
      { x: 0, y: 700 },   // القالب 5
    ];
    const offset = offsets[templateId] || { x: 0, y: 700 };
    return {
      x: canvasWidth / 2 + offset.x,
      y: (canvasHeight + offset.y) / 2,
    };
  };

  // رسم النصوص على الكانفاس
  const drawText = (ctx, canvasWidth, canvasHeight) => {
    if (data.length === 0 && position.length === 0) return;

    const textPos = getTextConfig(canvasWidth, canvasHeight, clickedId);

    if (data.length > 0) {
      ctx.font = "bold 36px Alexandria";
      ctx.fillStyle = cssVar("--color-canvas-name");
      ctx.textAlign = "center";
      ctx.fillText(data, textPos.x, textPos.y);
    }

    if (position.length > 0) {
      ctx.font = "25px Alexandria";
      ctx.fillStyle = cssVar("--color-canvas-dept");
      ctx.textAlign = "center";
      ctx.fillText(position, textPos.x, textPos.y + 40);
    }
  };

  // رسم الكانفاس
  const renderCanvas = () => {
    if (!canvasRef.current) {
      setTimeout(() => {
        if (canvasRef.current) renderCanvas();
        else setIsLoading(false);
      }, 500);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setIsLoading(false); return; }

    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = 100;
      canvas.height = 100;
    }

    const loadingTimeout = setTimeout(() => setIsLoading(false), 5000);

    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      clearTimeout(loadingTimeout);
      try {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        setCanvasDimensions({ width: img.naturalWidth, height: img.naturalHeight });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawText(ctx, canvas.width, canvas.height);

        if (canvasRef.current) {
          setShareImageData(canvasRef.current.toDataURL("image/png"));
        }
      } catch {
        // fallback silently
      } finally {
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      clearTimeout(loadingTimeout);
      try {
        canvas.width = 800;
        canvas.height = 600;
        setCanvasDimensions({ width: 800, height: 600 });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 24px Alexandria";
        ctx.fillStyle = "#ff0000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("خطأ في تحميل الصورة", canvas.width / 2, canvas.height / 2);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    img.src = selectedImage;
    if (img.complete) {
      setTimeout(() => img.onload(), 50);
    }
  };

  // تحميل البطاقة
  const htmlToImageConvert = (event) => {
    event.preventDefault();

    if (!canvasRef.current) {
      alert("عذراً، حدث خطأ أثناء تجهيز البطاقة. يرجى المحاولة مرة أخرى.");
      return;
    }

    if (isLoading) {
      alert("يرجى الانتظار حتى يتم تحميل البطاقة بالكامل");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("عذراً، حدث خطأ أثناء تجهيز البطاقة. يرجى المحاولة مرة أخرى.");
      return;
    }

    setIsLoading(true);

    const image = new Image();
    image.crossOrigin = "Anonymous";

    const downloadTimeout = setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png");
      triggerDownload(dataUrl);
      setIsLoading(false);
    }, 3000);

    image.onload = () => {
      clearTimeout(downloadTimeout);
      try {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        drawText(ctx, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/png");
        triggerDownload(dataUrl);
      } catch {
        const dataUrl = canvas.toDataURL("image/png");
        triggerDownload(dataUrl);
      }
    };

    image.onerror = () => {
      clearTimeout(downloadTimeout);
      const dataUrl = canvas.toDataURL("image/png");
      triggerDownload(dataUrl);
    };

    const triggerDownload = (dataUrl) => {
      try {
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = "امانة-نجران-بطاقة-معايدة.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        if (typeof incrementDownloadCount === "function") {
          incrementDownloadCount(null, data, position);
        }

        setShowSuccessNotification(true);
        setIsLoading(false);

        setTimeout(() => renderCanvas(), 100);
      } catch {
        setIsLoading(false);
        alert("عذراً، حدث خطأ أثناء تحميل البطاقة. يرجى المحاولة مرة أخرى.");
      }
    };

    image.src = selectedImage;
    if (image.complete) {
      image.onload();
    }
  };

  // إعداد الكانفاس عند التحميل الأول
  useEffect(() => {
    const setupTimer = setTimeout(() => {
      if (canvasRef.current) {
        setIsLoading(true);
        if (canvasRef.current.width === 0 || canvasRef.current.height === 0) {
          canvasRef.current.width = 100;
          canvasRef.current.height = 100;
        }
        renderCanvas();
      } else {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(setupTimer);
  }, []);

  const handleCardSelection = (index) => {
    setIsLoading(true);
    setSelectedImage(images[index]);
    setClickedId(index);
    setActive(index);
  };

  const handleFeedbackSubmit = (feedbackData) => {
    return saveFeedback(feedbackData).then(() => {
      setShowFeedbackForm(false);
    });
  };

  const cardTemplate = [
    { id: 1, title: "اختر قالب البطاقة" },
    { id: 2, title: "اكتب اسمك هنا" },
    { id: 3, title: "عاين البطاقة وحملها" },
  ];

  return (
    <div className="lg:max-w-4xl mx-auto pt-20 pb-16">
      <VisitorCounter />
      <DownloadCounter />
      <MilestoneNotification />

      {showSuccessNotification && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md animate-fade-in flex items-center z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>تم تحميل البطاقة بنجاح!</span>
        </div>
      )}

      <SocialShareButtons
        show={showSocialShare}
        onClose={() => setShowSocialShare(false)}
        imageDataUrl={shareImageData}
      />

      <FeedbackForm
        show={showFeedbackForm}
        onClose={() => setShowFeedbackForm(false)}
        onSubmit={handleFeedbackSubmit}
      />

      <div className="relative">
        <NextImage
          src={logoSrc}
          alt="logo"
          width="200"
          height="100"
          className="mx-auto mb-3"
        />
        <h1 className="text-2xl w-3/4 lg:w-1/2 mx-auto text-center">
          صمم بطاقة المعايدة الخاصة بك
        </h1>

        <div className="text-center mt-7">
          {cardTemplate.map((card, index) => (
            <div key={index} id={card.id} className="mb-5">
              <div className="flex flex-col justify-center items-center gap-2 flex-wrap">
                <span className="rounded-full bg-primary shadow text-[40px] font-bold h-[88px] w-[88px] mx-auto block text-center leading-[88px] text-white">
                  {card.id}
                </span>
                <div className="mb-8 block text-[1.5rem]">
                  <h2 className="mb-2 block text-[1.5rem]">{card.title}</h2>
                </div>
                {card.id === 1 ? (
                  <div className="flex justify-center items-center w-full">
                    <ImageSlider
                      images={images}
                      onSelect={handleCardSelection}
                      selectedIndex={isActive}
                    />
                  </div>
                ) : card.id === 2 ? (
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
                    id="result"
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
                        boxSizing: "border-box",
                      }}
                    />
                    {isLoading && (
                      <div className="flex flex-col items-center justify-center h-96 w-full absolute top-0 left-0 right-0 bottom-0">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
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
              id="download-image-link"
              href="#"
              onClick={htmlToImageConvert}
              className="bg-primary text-white px-4 py-4 rounded-lg block w-full transition-all duration-300 hover:bg-primary-dark hover:scale-105 flex-1"
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
};
export default Holiday;
