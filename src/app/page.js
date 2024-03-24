"use client";
import { useState, useEffect, useRef } from "react";

import Form from "@/components/form/Form";
import NextImage from "next/image";
import bg from "../../public/bg.jpg";
import bg2 from "../../public/bg2.jpg";
import bg3 from "../../public/bg3.jpg";

export default function Home() {
  const images = [bg, bg2, bg3];
  const [data, setData] = useState([]);
  const [pos, setPos] = useState([]);
  const [imgs, setImage] = useState(bg);
  const elementRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load the image
    const image = new Image();
    image.onload = () => {
      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Write text in the center of the canvas
      const text = data;
      ctx.font = "30px Arial";
      const textWidth = ctx.measureText(text).width;
      const x = (canvas.width - textWidth) / 2;
      const y = (canvas.height + 15) / 2; // Add some padding to position text vertically
      ctx.fillStyle = "white"; // Adjust fill style as needed
      ctx.fillText(text, x, y);
    };
    image.src = imgs; // Replace with your image URL
  }, [imgs, data]);
  const htmlToImageConvert = (event) => {
    // toPng(elementRef.current, { cacheBust: false })
    //   .then((dataUrl) => {
    //     const link = document.createElement("a");
    //     link.download = "my-image-name.png";
    //     link.href = dataUrl;
    //     link.click();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    let link = event.currentTarget;
    link.download = "my-image-name.png";
    let image = canvasRef.current.toDataURL("image/png");
    link.href = image;
  };
  const [isActive, setActive] = useState(false);

  return (
    <div className="lg:max-w-4xl   mx-auto pt-20">
      <h1 className="text-2xl w-3/4 lg:w-1/2  mx-auto text-center">
        صمم بطاقة المعايدة الخاصة بك في أقل من دقيقة
      </h1>
      <div className="text-center mt-7">
        <span className="rounded-full bg-[#84923a] shadow text-[40px] font-bold h-[88px] w-[88px] mx-auto block text-center leading-[88px] text-white">
          1
        </span>
        <span className="mb-8 block text-[1.5rem]">اختر قالب البطاقة</span>
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {images.map((img, i) => (
            <NextImage
              src={img}
              key={i}
              priority
              alt="cardImage"
              onClick={() => {
                setImage(img);
                setActive(i);
              }}
              className={`h-[220px] w-[120px] cursor-pointer ${
                isActive == i ? "border-[#cbe44c] border-[2px]" : ""
              }`}
            />
          ))}
        </div>
        <div className="border-t-[1px] border-b-[1px]  border-[#d2d2d2] mt-10 ">
          <span className="rounded-full mt-8 bg-[#84923a] shadow text-[40px] font-bold h-[88px] w-[88px] mx-auto block text-center leading-[88px] text-white">
            2
          </span>
          <span className=" block text-[1.5rem] my-3">اكتب اسمك هنا </span>
          <div className="flex justify-center flex-col lg:flex-row gap-2">
            <input
              type="text"
              className="h-12 w-[80%] lg:w-1/2 mx-auto rounded-lg shadow  border-[#373737] p-2 hover:border-green-800 focus:outline-none mb-3 lg:mb-8"
              name=""
              id=""
              aria-describedby="helpId"
              placeholder="اكتب اسمك"
              value={data}
              onChange={(event) => {
                setData(event.target.value);
              }}
            />
            <input
              type="text"
              className="h-12 w-[80%] lg:w-1/2 mx-auto rounded-lg shadow  border-[#373737] p-2 hover:border-green-800 focus:outline-none mb-3 lg:mb-8"
              name=""
              id=""
              aria-describedby="helpId"
              placeholder="اكتب اسم الادارة"
              value={pos}
              onChange={(event) => {
                setPos(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="border-t-[1px] border-b-[1px]  border-[#d2d2d2] mt-10 ">
          <span className="rounded-full mt-8 bg-[#84923a] shadow text-[40px] font-bold h-[88px] w-[88px] mx-auto block text-center leading-[88px] text-white">
            3
          </span>
          <span className=" block text-[1.5rem] my-3">عاين البطاقة وحملها</span>
          <div
            ref={elementRef}
            className=" flex justify-center items-center w-full mb-10 relative"
            id="result"
          >
            {/* <div className="absolute  top-[320px]">
              <h2 className="text-[15px] text-white">{data}</h2>
              <p className="text-[10px]">{pos}</p>
            </div>
            <Image src={imgs} alt="" priority /> */}
            <canvas ref={canvasRef} width={1125} height={1905} />
          </div>
          <a
            id="download-image-link"
            href="download-link"
            onClick={htmlToImageConvert}
            className="bg-[#83923b] text-white px-4 py-2 rounded-lg mb-4"
          >
            تحميل البطاقة
          </a>
        </div>
      </div>
      <Form />
    </div>
  );
}
