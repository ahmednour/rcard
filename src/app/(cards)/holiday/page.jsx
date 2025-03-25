"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Form from "../../../components/form/Form";
import NextImage from "next/image";
import bg1 from "@/public/bg1.jpg";
import bg2 from "@/public/bg2.jpg";
import bg3 from "@/public/bg3.jpg";
import logo from "@/public/Najran-Municipality.svg";
import VisitorCounter from "../../../components/VisitorCounter";
import ClientProvider from "../../../components/ClientProvider";

const Holiday = () => {
  const images = useMemo(() => [bg1, bg2, bg3], []);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState([]);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [clickedId, setClickedId] = useState(0);
  const [isActive, setActive] = useState(0);
  const elementRef = useRef(null);
  const canvasRef = useRef(null);

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
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(initialImage, 0, 0, canvas.width, canvas.height);

          // Also draw any initial text if needed
          if (data.length > 0 || position.length > 0) {
            const textConfig = {
              x: canvas.width / 2 + 300,
              y: (canvas.height + 500) / 2,
              color: "#fbb040",
            };

            ctx.font = "bold 36px Alexandria";
            ctx.fillStyle = textConfig.color;
            ctx.textAlign = "center";
            ctx.fillText(data, textConfig.x, textConfig.y);

            ctx.font = "25px Alexandria";
            ctx.fillStyle = "#ab8150";
            ctx.fillText(position, textConfig.x, textConfig.y + 40);
          }
        };
        initialImage.src = images[0].src;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [images, data, position]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const isFirstTemplate = clickedId === 0;
      const isSecondTemplate = clickedId === 1;
      const isThirdTemplate = clickedId === 2;

      const textConfig = {
        x:
          canvas.width / 2 +
          (isFirstTemplate ? 300 : isSecondTemplate ? 250 : 50),
        y:
          (canvas.height +
            (isFirstTemplate ? 500 : isSecondTemplate ? 520 : 450)) /
          2,
        color: isFirstTemplate
          ? "#fbb040"
          : isSecondTemplate
          ? "#fbb040"
          : "#fbb040",
      };

      ctx.font = "bold 36px Alexandria";
      ctx.fillStyle = textConfig.color;
      ctx.textAlign = "center";
      ctx.fillText(data, textConfig.x, textConfig.y);

      ctx.font = "25px Alexandria";
      ctx.fillStyle = isFirstTemplate
        ? "#ab8150"
        : isSecondTemplate
        ? "#ab8150"
        : "#ab8150";
      ctx.fillText(position, textConfig.x, textConfig.y + 40);
    };
    image.src = selectedImage?.src || images[0].src;
  }, [selectedImage, data, position, clickedId]);
  const htmlToImageConvert = (event) => {
    let link = event.currentTarget;
    link.download = "my-image-name.png";
    let image = canvasRef.current.toDataURL("image/png");
    link.href = image;
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
  // select card template
  const selectCardTemplate = images.map((img, i) => (
    <NextImage
      src={img}
      id={i + 1}
      key={i}
      priority
      alt="cardImage"
      onClick={() => {
        setSelectedImage(img);
        setActive(i);
        setClickedId(i); // Increment by 1 to match the card template IDs
      }}
      className={`h-[238.25px] w-[336px] cursor-pointer ${
        isActive === i ? "border-[#cbe44c] border-[2px]" : ""
      }`}
    />
  ));
  return (
    <ClientProvider>
      <div className="lg:max-w-4xl mx-auto pt-20">
        <VisitorCounter />
        <NextImage
          src={logo}
          alt="logo"
          width="200"
          height="100"
          className="mx-auto mb-3"
        />
        <h1 className="text-2xl w-3/4 lg:w-1/2  mx-auto text-center">
          صمم بطاقة المعايدة الخاصة بك في أقل من دقيقة
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
                      width={1344}
                      height={943}
                      className="text-center"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <a
            id="download-image-link"
            href="download-link"
            onClick={htmlToImageConvert}
            className="bg-[#83923b] text-white px-4 py-4 rounded-lg mb-7 block w-[80%] mx-auto transition-all duration-300 hover:bg-[#6b7830] hover:scale-105"
          >
            تحميل البطاقة
          </a>
        </div>
      </div>
    </ClientProvider>
  );
};
export default Holiday;
