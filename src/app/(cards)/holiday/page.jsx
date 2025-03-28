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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const [shareImageData, setShareImageData] = useState(null);

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

  // Use the renderCanvas function in the main useEffect
  useEffect(() => {
    setIsLoading(true);
    // Clear the canvas first to avoid showing stale content
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    renderCanvas();
  }, [selectedImage, data, position, clickedId]);

  // Make sure we're getting the download context properly
  useEffect(() => {
    console.log("Holiday page - useDownload hook result:", {
      incrementDownloadCount,
      saveFeedback,
    });
  }, [incrementDownloadCount, saveFeedback]);

  // Dedicated function to render canvas with improved error handling
  const renderCanvas = () => {
    // Canvas should always be available now, but check just in case
    if (!canvasRef.current) {
      console.error(
        "Canvas reference is not available for rendering - will retry once"
      );
      // Only try once more and then give up
      setTimeout(() => {
        if (canvasRef.current) {
          console.log("Canvas is now available after retry");
          renderCanvas();
        } else {
          console.error("Canvas still not available after retry - giving up");
          setIsLoading(false);
        }
      }, 500);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Could not get canvas context");
      setIsLoading(false);
      return;
    }

    // Set canvas visible size to at least 100px to ensure it's rendered
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = 100;
      canvas.height = 100;
    }

    // Set a loading timeout safety
    const loadingTimeout = setTimeout(() => {
      console.warn("Image loading timeout - forcing render completion");
      setIsLoading(false);
    }, 5000); // 5-second safety timeout

    // Select the correct image to load
    const img = new Image();
    img.crossOrigin = "Anonymous";

    console.log("Starting render with selected image:", selectedImage);

    img.onload = () => {
      clearTimeout(loadingTimeout);
      console.log("Image loaded successfully:", img.src, "dimensions:", {
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      try {
        // Set canvas dimensions to match actual image dimensions
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Update dimensions in state
        setCanvasDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });

        // Clear and draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw text if needed
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
                  ? 950
                  : isSecondTemplate
                  ? 50
                  : isThirdTemplate
                  ? 700
                  : isFourthTemplate
                  ? 700
                  : isFifthTemplate
                  ? 700
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

        console.log("Canvas rendered successfully");

        // After drawing everything on the canvas
        if (canvasRef.current) {
          const dataUrl = canvasRef.current.toDataURL("image/png");
          setShareImageData(dataUrl);
        }
      } catch (error) {
        console.error("Error rendering canvas:", error);
      } finally {
        // Always mark as loaded/not loading even if there's an error in rendering
        setImageLoaded(true);
        setIsLoading(false);
      }
    };

    img.onerror = (error) => {
      clearTimeout(loadingTimeout);
      console.error("Failed to load image:", selectedImage, error);

      // Attempt to render a fallback
      try {
        // Set canvas to a default size
        canvas.width = 800;
        canvas.height = 600;

        // Update dimensions in state
        setCanvasDimensions({
          width: 800,
          height: 600,
        });

        // Clear canvas and draw error message
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw error message
        ctx.font = "bold 24px Alexandria";
        ctx.fillStyle = "#ff0000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          "خطأ في تحميل الصورة",
          canvas.width / 2,
          canvas.height / 2
        );
      } catch (e) {
        console.error("Error rendering fallback:", e);
      } finally {
        // Always set loading to false
        setIsLoading(false);
      }
    };

    // Add onabort handler
    img.onabort = () => {
      clearTimeout(loadingTimeout);
      console.error("Image loading aborted:", selectedImage);
      setIsLoading(false);
    };

    // Make sure to always load the image
    try {
      img.src = selectedImage;

      // Additional safety check for immediately cached images
      if (img.complete) {
        console.log("Image already loaded from cache");
        setTimeout(() => {
          img.onload();
        }, 50); // Small delay to ensure handlers are properly set up
      }
    } catch (error) {
      console.error("Error setting image source:", error);
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    }
  };

  // Function to handle image download
  const htmlToImageConvert = (event) => {
    event.preventDefault();

    if (!canvasRef.current) {
      console.error("Canvas reference is not available for download");
      alert("عذراً، حدث خطأ أثناء تجهيز البطاقة. يرجى المحاولة مرة أخرى.");
      return;
    }

    // Ensure we're not in a loading state
    if (isLoading) {
      console.warn("Image is still loading, please wait");
      alert("يرجى الانتظار حتى يتم تحميل البطاقة بالكامل");
      return;
    }

    try {
      // Make sure we're drawing at full resolution for download
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Could not get canvas context for download");
        alert("عذراً، حدث خطأ أثناء تجهيز البطاقة. يرجى المحاولة مرة أخرى.");
        return;
      }

      console.log("Starting download with canvas dimensions:", {
        width: canvas.width,
        height: canvas.height,
      });

      // Show download preparation indicator
      setIsLoading(true);

      // Redraw everything at full quality for download
      const image = new Image();
      image.crossOrigin = "Anonymous";

      // Set a loading timeout for download
      const downloadTimeout = setTimeout(() => {
        console.warn("Download timeout - using current canvas state");
        // Get data URL from current canvas state
        const dataUrl = canvas.toDataURL("image/png");
        triggerDownload(dataUrl);
        setIsLoading(false);
      }, 3000);

      image.onload = () => {
        clearTimeout(downloadTimeout);
        console.log("Image loaded for download:", {
          width: image.naturalWidth,
          height: image.naturalHeight,
        });

        try {
          // Ensure canvas is at full resolution for download
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;

          // Clear and redraw
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          // Add text with consistent positioning
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
                    ? 950
                    : isSecondTemplate
                    ? 50
                    : isThirdTemplate
                    ? 700
                    : isFourthTemplate
                    ? 700
                    : isFifthTemplate
                    ? 700
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

          // Get data URL after drawing is complete
          const dataUrl = canvas.toDataURL("image/png");
          triggerDownload(dataUrl);
        } catch (error) {
          console.error("Error creating download image:", error);
          // Get data URL from current canvas state as fallback
          const dataUrl = canvas.toDataURL("image/png");
          triggerDownload(dataUrl);
        }
      };

      image.onerror = (error) => {
        clearTimeout(downloadTimeout);
        console.error(
          "Failed to load image for download:",
          selectedImage,
          error
        );
        // Get data URL from current canvas state as fallback
        const dataUrl = canvas.toDataURL("image/png");
        triggerDownload(dataUrl);
      };

      // Helper function to trigger the download
      const triggerDownload = (dataUrl) => {
        try {
          // Set up download
          const downloadLink = document.createElement("a");
          downloadLink.href = dataUrl;
          downloadLink.download = "امانة-نجران-بطاقة-معايدة.png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Increment download count
          if (typeof incrementDownloadCount === "function") {
            incrementDownloadCount();
          }

          // Show success notification
          setShowSuccessNotification(true);

          // Hide loading indicator
          setIsLoading(false);

          console.log("Download completed successfully");

          // Re-render the canvas for display with original dimensions
          setTimeout(() => {
            renderCanvas();
          }, 100);
        } catch (error) {
          console.error("Error during download:", error);
          setIsLoading(false);
          alert("عذراً، حدث خطأ أثناء تحميل البطاقة. يرجى المحاولة مرة أخرى.");
        }
      };

      console.log("Loading image for download:", selectedImage);
      // Load the image
      image.src = selectedImage;

      // Handle case where image might be cached and onload doesn't fire
      if (image.complete) {
        console.log("Image already cached for download");
        image.onload();
      }
    } catch (error) {
      console.error("Unexpected error during download process:", error);
      setIsLoading(false);
      alert("عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    }
  };

  // Simplify the component mount effect
  useEffect(() => {
    console.log("Component mounted, setting up canvas...");

    // We need to give the browser a moment to render the canvas
    const setupTimer = setTimeout(() => {
      // Force initial render at the component's first mount
      if (canvasRef.current) {
        console.log("Canvas element found in DOM on initial mount");
        setIsLoading(true);

        // Set canvas to minimum dimensions initially so it exists in DOM
        if (canvasRef.current.width === 0 || canvasRef.current.height === 0) {
          canvasRef.current.width = 100;
          canvasRef.current.height = 100;
        }

        // Let the normal render cycle handle the rest
        renderCanvas();
      } else {
        console.warn(
          "Canvas element not found on initial mount - this should not happen"
        );
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(setupTimer);
  }, []);

  // Handle card selection with improved loading states
  const handleCardSelection = (index) => {
    console.log("Card selected:", index, "Loading image:", images[index]);
    setIsLoading(true);
    setImageLoaded(false);
    setSelectedImage(images[index]);
    setClickedId(index);
    setActive(index);
  };

  const handleShareClose = () => {
    setShowSocialShare(false);
  };

  const handleFeedbackClose = () => {
    setShowFeedbackForm(false);
  };

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
      <SocialShareButtons
        show={showSocialShare}
        onClose={handleShareClose}
        imageDataUrl={shareImageData}
      />

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
