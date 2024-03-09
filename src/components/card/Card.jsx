import Image from "next/image";

const Card = () => {
  return (
      <div className="w-full h-full bg-[#3f4719]">
        <Image src="/bg.jpg" alt="bg" layout="fill" objectFit="contain" objectPosition="center" />
    </div>
  )
}

export default Card