"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Form from "@/components/form/Form";
import NextImage from "next/image";
import VisitorCounter from "@/components/VisitorCounter";
import DownloadCounter from "@/components/DownloadCounter";
import { useDownload } from "@/lib/downloadContext";
import Link from "next/link";
import SocialShareButtons from "@/components/SocialShareButtons";

// Preload the default image to get its actual dimensions before the component mounts
const preloadDefaultImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({
        img,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.onerror = () =>
      resolve({
        img: null,
        width: 1000,
        height: 1500,
      });
    img.src = src;
  });
};

const Invitation = () => {
  const bg10Src = "/bg10.jpeg";
  const logoSrc = "/Najran-Municipality.svg";
  const images = useMemo(() => [bg10Src], []);
  const [data, setData] = useState("");
  const [position, setPosition] = useState("");
  const [selectedImage, setSelectedImage] = useState(bg10Src);
  const [clickedId, setClickedId] = useState(1);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const elementRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const { incrementDownloadCount } = useDownload();
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [shareImageData, setShareImageData] = useState(null);

  // Load fonts first to ensure they're available for canvas
  useEffect(() => {
    // Check if the browser supports the Font Loading API
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(() => {
        setFontsLoaded(true);
      }, 500);
    }
  }, []);

  // Create new image and set up handlers for first render
  useEffect(() => {
    // Create a new image element
    const img = new Image();
    imageRef.current = img;

    img.onload = () => {
      setImageLoaded(true);
      renderCanvas();
    };

    img.onerror = () => {
      console.error("Failed to load image:", bg10Src);
      setImageLoaded(false);
    };

    img.src = bg10Src;
  }, []);

  // Handle image change when selecting different template
  useEffect(() => {
    const img = imageRef.current;
    if (img && img.src !== selectedImage) {
      setImageLoaded(false);
      img.src = selectedImage;
    }
  }, [selectedImage]);

  // Function to render the canvas with current state
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !imageRef.current.complete)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    // Always use the ACTUAL natural dimensions of the image directly
    const canvasWidth = img.naturalWidth;
    const canvasHeight = img.naturalHeight;

    // Set canvas dimensions to match image exactly
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image at its natural size
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

    // Ensure text is drawn only after the image is properly displayed
    requestAnimationFrame(() => {
      // Text configuration
      const isFirstTemplate = clickedId === 1;
      const textY = Math.floor(canvasHeight * 0.42); // Name position
      const dateY = Math.floor(canvasHeight * 0.58); // Date position

      // Scale font size based on image height
      const nameFontSize = Math.max(Math.floor(canvasHeight / 36), 36);
      const dateFontSize = Math.max(Math.floor(canvasHeight / 42), 32);

      // Draw name text
      if (data && data.length > 0) {
        ctx.font = `bold ${nameFontSize}px Alexandria, sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(data, canvasWidth / 2, textY);
      }

      // Draw date/position text
      if (position && position.length > 0) {
        ctx.font = `${dateFontSize}px Alexandria, sans-serif`;
        ctx.fillStyle = isFirstTemplate ? "#aa804e" : "white";
        ctx.textAlign = "center";
        ctx.fillText(position, canvasWidth / 2, dateY);
      }

      // After drawing everything
      requestAnimationFrame(() => {
        if (canvasRef.current) {
          const dataUrl = canvasRef.current.toDataURL("image/png");
          setShareImageData(dataUrl);
        }
      });
    });
  }, [data, position, clickedId]);

  // Re-render canvas when image loads or text changes
  useEffect(() => {
    if (imageLoaded && fontsLoaded) {
      renderCanvas();
    }
  }, [imageLoaded, fontsLoaded, renderCanvas]);

  // Hide success notification after a delay
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  // Handle download with proper download counter increment
  const htmlToImageConvert = (event) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete) return;

    // Make sure canvas is at full resolution for download
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Redraw at full resolution
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Add text
    const isFirstTemplate = clickedId === 1;
    const textY = Math.floor(canvas.height * 0.42);
    const dateY = Math.floor(canvas.height * 0.58);

    const nameFontSize = Math.max(Math.floor(canvas.height / 36), 36);
    const dateFontSize = Math.max(Math.floor(canvas.height / 42), 32);

    if (data && data.length > 0) {
      ctx.font = `bold ${nameFontSize}px Alexandria, sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(data, canvas.width / 2, textY);
    }

    if (position && position.length > 0) {
      ctx.font = `${dateFontSize}px Alexandria, sans-serif`;
      ctx.fillStyle = isFirstTemplate ? "#aa804e" : "white";
      ctx.textAlign = "center";
      ctx.fillText(position, canvas.width / 2, dateY);
    }

    // Get the image and trigger download
    const image = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = image;
    downloadLink.download = "امانة-نجران-بطاقة-دعوة.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Increment download count
    if (typeof incrementDownloadCount === "function") {
      incrementDownloadCount();
    }

    // Show success notification
    setShowSuccessNotification(true);

    // Re-render the canvas for display
    renderCanvas();
  };

  const [isActive, setActive] = useState(0);

  // card template
  const cardTemplate = [
    {
      id: 1,
      title: "اختر قالب البطاقة",
      description: "اختر قالب البطاقة الذي تريده",
    },
    {
      id: 2,
      title: "اكتب اسمك هنا",
      description: "اكتب اسمك هنا",
    },
    {
      id: 3,
      title: "عاين البطاقة وحملها",
    },
  ];

  // select card template
  const selectCardTemplate = images.map((img, i) => (
    <div
      key={i}
      className={`relative ${
        isActive === i ? "ring-4 ring-[#84923a] rounded-lg" : ""
      }`}
    >
      <NextImage
        src={img}
        id={i + 1}
        priority={true}
        alt="cardImage"
        width={400}
        height={600}
        className="w-full max-w-[400px] h-auto cursor-pointer rounded-lg transition-all duration-300 hover:shadow-lg"
        onClick={() => {
          setSelectedImage(img);
          setActive(i);
          setClickedId(i + 1);
        }}
      />
      {isActive === i && (
        <div className="absolute top-2 right-2 bg-[#84923a] text-white rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  ));

  const handleShareClose = () => {
    setShowSocialShare(false);
  };

  return (
    <div className="lg:max-w-4xl mx-auto pt-20">
      <VisitorCounter />
      <DownloadCounter />

      {/* Social Share Panel */}
      <SocialShareButtons
        show={showSocialShare}
        onClose={handleShareClose}
        imageDataUrl={shareImageData}
      />

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md animate-fade-in flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>تم تحميل البطاقة بنجاح!</span>
        </div>
      )}

      <div className="relative">
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 rtl:sm:space-x-reverse">
          <Link
            href="/help"
            className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 py-1 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs flex items-center shadow-sm transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-0.5 sm:ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            المساعدة
          </Link>
          <Link
            href="/admin/login"
            className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 py-1 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs flex items-center shadow-sm transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-0.5 sm:ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            الإدارة
          </Link>
        </div>

        <NextImage
          src={logoSrc}
          alt="logo"
          width="200"
          height="100"
          className="mx-auto mb-3"
        />
        <h1 className="text-2xl w-3/4 lg:w-1/2  mx-auto text-center">
          تصميم كارت دعوه لحضور لقاء المستثمرين ورجال الاعمال
        </h1>

        <div className="text-center mt-7">
          {cardTemplate.map((card, index) => (
            <div key={index} id={card.id} className="mb-5">
              <div className="flex flex-col justify-center items-center gap-2 flex-wrap">
                <span className="rounded-full bg-[#84923a] shadow text-[40px] font-bold h-[88px] w-[88px] mx-auto block text-center leading-[88px] text-white">
                  {card.id}
                </span>
                <div className="mb-8 block text-[1.5rem]">
                  <h2 className="mb-2 block text-[1.5rem]">{card.title}</h2>
                </div>
                {card.id === 1 ? (
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    {selectCardTemplate}
                  </div>
                ) : card.id === 2 ? (
                  <Form
                    type="invitation"
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
                    style={{ minHeight: "600px" }}
                  >
                    {imageLoaded ? (
                      <canvas
                        ref={canvasRef}
                        className="text-center max-w-full h-auto border rounded-lg shadow-md"
                        style={{
                          maxHeight: "80vh",
                          maxWidth: "100%",
                          objectFit: "contain",
                          display: "block",
                          margin: "0 auto",
                          boxSizing: "border-box",
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-96 w-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#84923a] mb-4"></div>
                        <p className="text-gray-600">جاري تحميل البطاقة...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-3 w-[80%] mx-auto mb-7">
            <a
              id="download-image-link"
              href="#"
              onClick={htmlToImageConvert}
              className="bg-[#83923b] text-white px-4 py-4 rounded-lg block w-full transition-all duration-300 hover:bg-[#6b7830] hover:scale-105 flex-1"
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                تحميل البطاقة
              </div>
            </a>

            <button
              onClick={() => setShowSocialShare(true)}
              className="bg-blue-600 text-white px-4 py-4 rounded-lg block w-full md:w-auto transition-all duration-300 hover:bg-blue-700 hover:scale-105"
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
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

export default Invitation;
