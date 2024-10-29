"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Form from "../../../components/form/Form";
import NextImage from "next/image";
import bg10 from "@/public/bg10.jpeg";
import logo from "@/public/Najran-Municipality.svg";
import { logout } from "../../login/actions";
const Invitation = () => {
  const images = useMemo(() => [bg10], []);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState([]);
  const [selectedImage, setSelectedImage] = useState(bg10);
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
        x: canvas.width / 2 + 0,
        y: (canvas.height - 520) / 2,
        color: "white",
      };
      const dateConfig = {
        x: canvas.width / 2 + 0,
        y: (canvas.height + 520) / 2 + 100,
        color: "#fff",
      };

      ctx.font = "bold 36px Alexandria";
      ctx.fillStyle = textConfig.color;
      ctx.textAlign = "center";
      ctx.fillText(data, textConfig.x, textConfig.y);

      ctx.font = "25px Alexandria";
      ctx.fillStyle = isFirstTemplate ? "#aa804e" : "#fff";
      ctx.fillText(position, dateConfig.x, dateConfig.y + 40);
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
      id={i + 1}
      key={i}
      priority
      alt="cardImage"
      onClick={() => {
        setSelectedImage(img);
        setActive(i);
        setClickedId(i); // Increment by 1 to match the card template IDs
      }}
      className={`h-[600px] w-[400px] cursor-pointer ${
        isActive === i ? "border-[#cbe44c] border-[2px]" : ""
      }`}
    />
  ));
  return (
    <div className="lg:max-w-4xl mx-auto pt-20">
      <button onClick={() => logout()}>Logout</button>
      <NextImage
        src={logo}
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
          href="download-link"
          onClick={htmlToImageConvert}
          className="bg-[#83923b] text-white px-4 py-4 rounded-lg mb-7 block w-[80%] mx-auto transition-all duration-300 hover:bg-[#6b7830] hover:scale-105"
        >
          تحميل البطاقة
        </a>
      </div>
    </div>
  );
};
export default Invitation;
