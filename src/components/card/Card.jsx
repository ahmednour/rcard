import Image from "next/image";
const Card = ({ name, pos, path }) => {
  const Print = () => {
    let printContents = document.getElementById('result').innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }
  return (
    <div className="w-full h-screen  bg-[#3f4719]">
      <div id="result" className="absolute right-0 z-10 h-screen w-full flex justify-center flex-col items-center text-center">
        <input className="text-white text-[20px] bg-transparent placeholder:text-white text-center w-2/3" placeholder="اكتب اسمك هنا " />
        <input className="text-[14px] bg-transparent  placeholder:text-white text-center w-2/3" placeholder="اكتب اسم الادارة" />
      </div>
      <Image src={path} alt="bg" className="object-fill h-full w-full" />
    </div>
  )
}

export default Card