import Image from "next/image";
const Card = ({ name, pos, path }) => {
  return (
    <div className="w-full h-full  bg-[#3f4719]">
      <div id="result" className="absolute right-0 z-10 h-full w-full flex justify-center flex-col items-center text-center">
        <input className="text-white text-[20px] bg-transparent placeholder:text-white text-center w-2/3" placeholder="اكتب اسمك هنا " />
        <input className="text-[14px] bg-transparent  placeholder:text-white text-center w-2/3" placeholder="اكتب اسم الادارة" />
      </div>
      <Image src={path} alt="bg" className="object-fill" />
    </div>
  )
}

export default Card