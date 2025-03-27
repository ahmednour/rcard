"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Form from "@/components/form/Form";
import NextImage from "next/image";
import VisitorCounter from "@/components/VisitorCounter";
import DownloadCounter from "@/components/DownloadCounter";
import MilestoneNotification from "@/components/MilestoneNotification";
import SocialShareButtons from "@/components/SocialShareButtons";
import FeedbackForm from "@/components/FeedbackForm";
import ImageSlider from "@/components/card/ImageSlider";
import { useDownload } from "@/lib/downloadContext";
import Link from "next/link";

const Holiday = () => {
  const bg1Src = "/bg1.jpg";
  const bg2Src = "/bg2.jpg";
  const bg3Src = "/bg3.jpg";
  const bg4Src = "/bg4.jpg";
  const bg5Src = "/bg5.jpg";
  const logoSrc = "/Najran-Municipality.svg";
  const images = useMemo(() => [bg1Src, bg2Src, bg3Src, bg4Src, bg5Src], []);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState([]);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [clickedId, setClickedId] = useState(0);
  const [isActive, setActive] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({
    width: 1344,
    height: 943,
  });
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

  // Hide success notification after a delay
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
        // Show social share panel after success notification closes
        setShowSocialShare(true);
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  // Hide social share panel after a delay and show feedback form
  useEffect(() => {
    if (showSocialShare) {
      const timer = setTimeout(() => {
        setShowSocialShare(false);
        // Show feedback form after social share panel closes
        setShowFeedbackForm(true);
      }, 8000); // Hide after 8 seconds

      return () => clearTimeout(timer);
    }
  }, [showSocialShare]);

  // Load image dimensions when selected image changes
  useEffect(() => {
    if (selectedImage) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        // Update canvas dimensions to match the actual image dimensions
        setCanvasDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = selectedImage;
    }
  }, [selectedImage]);

  // Initial load effect to ensure bg1 is loaded first
  useEffect(() => {
    // Add a small delay to ensure the canvas is properly mounted
    const timer = setTimeout(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const initialImage = new Image();
        initialImage.crossOrigin = "Anonymous";
        initialImage.onload = () => {
          // Set canvas dimensions to match the actual image dimensions
          canvas.width = initialImage.naturalWidth;
          canvas.height = initialImage.naturalHeight;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(initialImage, 0, 0, canvas.width, canvas.height);

          // Also draw any initial text if needed
          if (data.length > 0 || position.length > 0) {
            // Use same text configuration logic as the main rendering effect
            const isFirstTemplate = clickedId === 0;
            const isSecondTemplate = clickedId === 1;
            const isThirdTemplate = clickedId === 2;
            const isFourthTemplate = clickedId === 3;
            const isFifthTemplate = clickedId === 4;

            const textConfig = {
              x:
                canvas.width / 2 +
                (isFirstTemplate
                  ? 0
                  : isSecondTemplate
                  ? 0
                  : isThirdTemplate
                  ? 260
                  : isFourthTemplate
                  ? 260
                  : isFifthTemplate
                  ? 0
                  : 100),
              y:
                (canvas.height +
                  (isFirstTemplate
                    ? 980
                    : isSecondTemplate
                    ? 20
                    : isThirdTemplate
                    ? 650
                    : isFourthTemplate
                    ? 700
                    : isFifthTemplate
                    ? 600
                    : 100)) /
                2,
              color: "#f98500",
            };

            ctx.font = "bold 36px Alexandria";
            ctx.fillStyle = textConfig.color;
            ctx.textAlign = "center";
            ctx.fillText(data, textConfig.x, textConfig.y);

            ctx.font = "25px Alexandria";
            ctx.fillStyle = "#8f5c22";
            ctx.fillText(position, textConfig.x, textConfig.y + 40);
          }
        };
        initialImage.src = selectedImage;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedImage, data, position, clickedId]);

  // Main rendering effect that updates when image, text, or position changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      // Set canvas dimensions to match the actual image dimensions
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      if (data.length > 0 || position.length > 0) {
        const isFirstTemplate = clickedId === 0;
        const isSecondTemplate = clickedId === 1;
        const isThirdTemplate = clickedId === 2;
        const isFourthTemplate = clickedId === 3;
        const isFifthTemplate = clickedId === 4;

        const textConfig = {
          x:
            canvas.width / 2 +
            (isFirstTemplate
              ? 250
              : isSecondTemplate
              ? 500
              : isThirdTemplate
              ? 200
              : isFourthTemplate
              ? 150
              : isFifthTemplate
              ? 100
              : 100),
          y:
            (canvas.height +
              (isFirstTemplate
                ? 700
                : isSecondTemplate
                ? 520
                : isThirdTemplate
                ? 450
                : isFourthTemplate
                ? 380
                : isFifthTemplate
                ? 310
                : 100)) /
            2,
          color: "#f98500",
        };

        // Set font and style for name
        ctx.font = "bold 36px Alexandria";
        ctx.fillStyle = textConfig.color;
        ctx.textAlign = "center";
        ctx.fillText(data, textConfig.x, textConfig.y);

        // Set font and style for position
        ctx.font = "25px Alexandria";
        ctx.fillStyle = "#8f5c22";
        ctx.fillText(position, textConfig.x, textConfig.y + 40);
      }
    };
    image.src = selectedImage;
  }, [selectedImage, data, position, clickedId]);

  // Make sure we're getting the download context properly
  useEffect(() => {
    console.log("Holiday page - useDownload hook result:", {
      incrementDownloadCount,
      saveFeedback,
    });
  }, [incrementDownloadCount, saveFeedback]);

  const htmlToImageConvert = (event) => {
    let link = event.currentTarget;
    link.download = "my-image-name.png";
    let image = canvasRef.current.toDataURL("image/png");
    link.href = image;

    // Increment download count when user downloads the image
    if (typeof incrementDownloadCount === "function") {
      console.log("Calling incrementDownloadCount in holiday page");
      incrementDownloadCount();
      console.log("Download count incremented in holiday page");
    } else {
      console.error(
        "incrementDownloadCount is not a function:",
        incrementDownloadCount
      );
    }

    // Show success notification
    setShowSuccessNotification(true);
  };

  // Close the social share panel
  const handleShareClose = () => {
    setShowSocialShare(false);
    // Show feedback form after closing share panel
    setShowFeedbackForm(true);
  };

  // Close the feedback form
  const handleFeedbackClose = () => {
    setShowFeedbackForm(false);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = (feedbackData) => {
    return new Promise((resolve) => {
      try {
        saveFeedback(feedbackData);
        setShowFeedbackForm(false);
        // Display thank you message or another notification here if desired
        setTimeout(() => {
          resolve();
        }, 500);
      } catch (error) {
        console.error("Error saving feedback:", error);
        resolve(); // Still resolve to close the form even if there's an error
      }
    });
  };

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

  // Replace the previous selectCardTemplate with the new Image Slider component
  const handleCardSelection = (index) => {
    setSelectedImage(images[index]);
    setClickedId(index);
    setActive(index);

    // Update canvas dimensions based on selected image
    const img = new Image();
    img.onload = () => {
      setCanvasDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = images[index];
  };

  useEffect(() => {
    const updateDimensions = () => {
      const containerWidth =
        elementRef.current?.clientWidth || window.innerWidth * 0.8;
      const aspectRatio = 1.4;
      setCanvasDimensions({
        width: Math.min(containerWidth, 1000),
        height: Math.min(containerWidth * aspectRatio, 1400),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="lg:max-w-4xl mx-auto pt-20 pb-16">
      <VisitorCounter />
      <DownloadCounter />
      <MilestoneNotification />

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

      {/* Social Share Panel */}
      <SocialShareButtons show={showSocialShare} onClose={handleShareClose} />

      {/* Feedback Form */}
      <FeedbackForm
        show={showFeedbackForm}
        onClose={handleFeedbackClose}
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
        <h1 className="text-2xl w-3/4 lg:w-1/2  mx-auto text-center">
          صمم بطاقة المعايدة الخاصة بك{" "}
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
                    className=" flex justify-center items-center w-[80%] mx-auto lg:w-full mb-10 relative"
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
                        display: "block",
                        margin: "0 auto",
                        boxSizing: "border-box",
                      }}
                    />
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
export default Holiday;
