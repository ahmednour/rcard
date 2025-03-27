"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Form from "@/components/form/Form";
import NextImage from "next/image";
import VisitorCounter from "@/components/VisitorCounter";
import DownloadCounter from "@/components/DownloadCounter";
import { useDownload } from "@/lib/downloadContext";
import Link from "next/link";

const Invitation = () => {
  const bg10Src = "/bg10.jpeg";
  const logoSrc = "/Najran-Municipality.svg";
  const images = useMemo(() => [bg10Src], []);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState([]);
  const [selectedImage, setSelectedImage] = useState(bg10Src);
  const [clickedId, setClickedId] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const elementRef = useRef(null);
  const canvasRef = useRef(null);
  const { incrementDownloadCount } = useDownload();

  // Hide success notification after a delay
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const isFirstTemplate = clickedId === 1;
      const textConfig = {
        x: canvas.width / 2 + 0,
        y: (canvas.height - 520) / 2,
        color: "white",
      };
      const dateConfig = {
        x: canvas.width / 2 + 0,
        y: (canvas.height + 20) / 2 + 100,
        color: "#fff",
      };

      ctx.font = "bold 36px Alexandria";
      ctx.fillStyle = textConfig.color;
      ctx.textAlign = "center";
      ctx.fillText(data, textConfig.x, textConfig.y);

      ctx.font = "32px Alexandria";
      ctx.fillStyle = isFirstTemplate ? "#aa804e" : "#fff";
      ctx.fillText(position, dateConfig.x, dateConfig.y + 40);
    };
    image.src = selectedImage;
  }, [selectedImage, data, position, clickedId]);

  // Make sure we're getting the download context properly
  useEffect(() => {
    console.log("Invitation page - useDownload hook result:", {
      incrementDownloadCount,
    });
  }, [incrementDownloadCount]);

  // Handle download with proper download counter increment
  const htmlToImageConvert = (event) => {
    let link = event.currentTarget;
    link.download = "my-image-name.png";
    let image = canvasRef.current.toDataURL("image/png");
    link.href = image;

    // Increment download count when user downloads the image
    if (typeof incrementDownloadCount === "function") {
      console.log("Calling incrementDownloadCount in invitation page");
      incrementDownloadCount();
      console.log("Download count incremented in invitation page");
    } else {
      console.error(
        "incrementDownloadCount is not a function:",
        incrementDownloadCount
      );
    }

    // Show success notification
    setShowSuccessNotification(true);
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
    <NextImage
      src={img}
      id={i + 1}
      key={i}
      priority
      alt="cardImage"
      width={400}
      height={600}
      className="w-full max-w-[400px] h-auto cursor-pointer"
      onClick={() => {
        setSelectedImage(img);
        setActive(i);
        setClickedId(i);
      }}
    />
  ));
  return (
    <div className="lg:max-w-4xl mx-auto pt-20">
      <VisitorCounter />
      <DownloadCounter />

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
                    className=" flex justify-center items-center w-[80%] mx-auto lg:w-full mb-10 relative"
                    id="result"
                  >
                    <canvas
                      ref={canvasRef}
                      width={1000}
                      height={1400}
                      className="text-center"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <a
            id="download-image-link"
            href="#"
            onClick={htmlToImageConvert}
            className="bg-[#83923b] text-white px-4 py-4 rounded-lg mb-7 block w-[80%] mx-auto transition-all duration-300 hover:bg-[#6b7830] hover:scale-105"
          >
            تحميل البطاقة
          </a>
        </div>
      </div>
    </div>
  );
};
export default Invitation;
