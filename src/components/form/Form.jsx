'use client';
import { useState } from 'react'
import React from 'react'
import Card from "@/components/card/Card";
import bg from '../../../public/bg.jpg';
import bg2 from '../../../public/bg2.jpg';
import bg3 from '../../../public/bg3.jpg';
const Form = () => {
    const [data, setData] = useState([]);
    const [pos, setPos] = useState([]);
    const imagePath = [bg, bg2, bg3]
    return (
        <div className="flex flex-wrap flex-row justify-start items-start h-full w-full max-w-sm">
            <div className="flex justify-between flex-col gap-3 h-full">
                <Card className="h-full w-full" name={data} pos={pos} path={bg} />
                {/* {
                    imagePath.map((img, i) => (
                        <div className="mobileDevice shadow-xl" key={i} id={`card-${i + 1}`}>
                            <div className="screen">
                                <Card className="h-full w-full" name={data} position={pos} path={img} />
                            </div>
                        </div>
                    ))
                } */}
            </div>
            {/* <div className="form mt-6 w-full absolute bottom-0 z-30">
                <h2 className="text-center text-3xl mb-3"> كارت معايدة </h2>
                <div className="my-4 flex flex-row justify-center gap-2 items-center">
                    <input
                        type="text"
                        className="h-12 w-full mx-auto rounded-lg shadow mb-2 p-2 hover:border-green-800 focus:outline-none"
                        name=""
                        id=""
                        aria-describedby="helpId"
                        placeholder="اكتب اسمك"
                        value={data}
                        onChange={event => {
                            setData(event.target.value);
                        }}
                    />
                    <input
                        type="text"
                        className="h-12 w-full mx-auto rounded-lg shadow mb-2 p-2 hover:border-green-800 focus:outline-none"
                        name=""
                        id=""
                        aria-describedby="helpId"
                        placeholder="اكتب الإدارة"
                        value={pos}
                        onChange={event => {
                            setPos(event.target.value);
                        }}
                    />
                </div>
            </div> */}
        </div>
    )
}

export default Form