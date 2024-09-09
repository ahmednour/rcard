/**
 * Home Component
 *
 * This component represents the main page of the application, allowing users to create and download custom greeting cards.
 *
 * Key Features:
 * 1. Image Selection: Users can choose from predefined card templates.
 * 2. Text Input: Users can add their name and department to the card.
 * 3. Card Preview: Real-time preview of the customized card using HTML5 Canvas.
 * 4. Card Download: Option to download the created card as an image.
 *
 * State Management:
 * - images: Array of available card background images.
 * - data: User's name input.
 * - pos: User's department/position input.
 * - selectedImage: Currently selected card background.
 * - clickedId: ID of the selected card template.
 * - isActive: Tracks which card template is currently active.
 *
 * Key Functions:
 * - useEffect: Handles the drawing of text on the canvas when inputs change.
 * - htmlToImageConvert: Converts the canvas to a downloadable image.
 *
 * @returns {JSX.Element} The rendered Home component
 */

"use client";
import { useState, useEffect, useRef, useMemo } from "react";

import Form from "@/components/form/Form";
import NextImage from "next/image";
import bg4 from "../../public/bg4.jpg";
import bg5 from "../../public/bg5.jpg";
import logo from "../../public/Najran-Municipality.svg";

export default function Home() {
  const images = useMemo(() => [bg4, bg5], []);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState([]);
  const [selectedImage, setSelectedImage] = useState(bg4);
  const [clickedId, setClickedId] = useState(null);
  const elementRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const isFirstTemplate = clickedId === 1;
      const textConfig = {
        x: canvas.width / 2 + (isFirstTemplate ? 300 : 250),
        y: (canvas.height + (isFirstTemplate ? 450 : 650)) / 2,
        color: isFirstTemplate ? "#e4cc68" : "white",
      };

      ctx.font = "bold 36px Alexandria";
      ctx.fillStyle = textConfig.color;
      ctx.textAlign = "center";
      ctx.fillText(data, textConfig.x, textConfig.y);

      ctx.font = "25px Alexandria";
      ctx.fillStyle = isFirstTemplate ? "#aa804e" : "#fff";
      ctx.fillText(position, textConfig.x, textConfig.y + 40);
    };
    image.src = selectedImage.src;
  }, [selectedImage, data, position, clickedId]);
  const htmlToImageConvert = (event) => {
    let link = event.currentTarget;
    link.download = "my-image-name.png";
    let image = canvasRef.current.toDataURL("image/png");
    link.href = image;
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
      id={i+1}
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
    <div className="lg:max-w-4xl mx-auto pt-20">
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
  );
}
