'use client';

import Header from "@/components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from "react";
import { IEvaluation, IHomestayDetails, getEvaluation, getHomestayDetailsClient, sendEvaluation } from "@/api/public";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { getHomestayDetails } from "@/api/homestay";
import Link from "next/link";
import Icon from "@/components/Icon";
import axios from "axios";

export default function Page({
    params
}: {
    params: {id: string}
}) {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification(); 
    const searchParams = useSearchParams();
    const homestayId = Number.parseInt(params.id);
    const [homestay,setHomestay] = useState<IHomestayDetails>();
    const address = searchParams.get("address");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [evaluation,setEvaluation] = useState<IEvaluation[]>([]);



    useEffect(()=>{
        fetchHomestayDetails();
        handleLogin();
    },[])
    
    const fetchHomestayDetails = async () =>{
        try {
            showLoading();
            const {data} = await getHomestayDetailsClient(homestayId);
            const {data:evaRes} = await getEvaluation(homestayId);
            setHomestay(data);
            setEvaluation(evaRes);
        } catch (error) {
            if(axios.isAxiosError(error)){
                notify(error.response?.data,"error");
            }
        }
        finally{
            hideLoading();
        }
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const handleLogin = async () => {
        const token = localStorage.getItem('token');
        // console.log(token);
        if (token) {
            setIsLoggedIn(true);
            // return "Invoice/";
        }else {
            setIsLoggedIn(false);
            // return "client-login/";
        }
    }

    // console.log(isLoggedIn);
    const starInit = [1, 2, 3, 4, 5];
    const [value, setValue] = useState(1);
    const [content,setContent] = useState("");

    const requestSendEvaluation = async () =>{
        try {
            console.log(value,content)
            const {data:res} = await sendEvaluation(homestayId,value,content);
            evaluation.push(res);
            setContent("");
            notify("successfully!","success");
        } catch (error) {
            if(axios.isAxiosError(error)){
                notify(error.response?.data,"error");
            }
        }
    }
    
    return (
        <>
            <section className="bg-slate-300">
                <Header />
                <section className="flex items-center justify-center mt-10">
                    <div className="flex items-center space-x-4">
                        {/* Hiển thị thông tin address */}
                        <div className="px-4 py-2 rounded-lg bg-white text-gray-800">
                        Address: {address}
                        </div>
                        {/* Hiển thị thông tin checkIn */}
                        <div className="px-4 py-2 rounded-lg bg-white text-gray-800">
                        Check In: {checkIn}
                        </div>
                        {/* Hiển thị thông tin checkOut */}
                        <div className="px-4 py-2 rounded-lg bg-white text-gray-800">
                        Check Out: {checkOut}
                        </div>
                    </div>
                </section>
                <section className="flex items-center justify-center mt-10 bg-white w-3/4  mx-auto rounded-xl shadow-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Hiển thị slide ảnh */}
                        <Slider {...settings}>
                        {homestay?.images.map((image) => (
                            <div className="mt-6 mb-6 pl-6 " key={image.id}>
                                <img className="object-fill rounded-2xl max-h-80 w-screen" src={image.url} alt={`Homestay ${homestay.homestayId}`} />
                            </div>
                        ))}
                        </Slider>
                        {/* Hiển thị thông tin bên phải */}
                        
                        <div className="flex flex-col gap-1 p-4">
                            <h2 className="font-bold mb-2 text-2xl text-cyan-800">{homestay?.name}</h2>
                            <p className="mb-2">Number of people: {homestay?.numPeople}</p>
                            <p className="mb-2 text-red-700 font-bold">Price: ${homestay?.price}</p>
                            {/* Hiển thị danh sách các tiện nghi */}
                            <h3 className="text-lg font-bold mb-1">Facilities:</h3>
                            <ul className="flex gap-3 pl-6 mb-2">
                                {homestay?.facilities.map((facility) => (
                                <li className="bg-emerald-50 p-2 rounded-lg" key={facility.id}>{facility.name}</li>
                                ))}
                            </ul>
                            {/* Hiển thị danh sách các khách du lịch */}
                            <h3 className="text-lg font-bold mb-1">Tourists:</h3>
                            <ul className="flex gap-3 pl-6">
                                {homestay?.tourists.map((tourist) => (
                                <li className="bg-emerald-50 p-2 rounded-lg" key={tourist.id}>{tourist.name}</li>
                                ))}
                            </ul>
                                {/* <button className="mt-4 w-full h-10 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900" > */}
                                {
                                    isLoggedIn ? ( 
                                        checkIn && checkOut ? (
                                        <Link className="mt-4 w-full h-10 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900 flex items-center justify-center" 
                                            href={{
                                            pathname: `${homestayId}/invoice/`,
                                            query: {
                                                // branchId: branchId,
                                                // address:address,
                                                checkIn: checkIn,
                                                checkOut: checkOut,
                                            }
                                        }}>Booking Now</Link>
                                        ) : (<Link className="mt-4 w-full h-10 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900 flex items-center justify-center" 
                                            href={{
                                            pathname: "./",
                                            
                                        }}>Booking Now</Link>)
                                    ) : (
                                        <Link className="mt-4 w-full h-10 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900 flex items-center justify-center" 
                                            href={{
                                            pathname: `/client-login/${homestayId}`,
                                            query: {
                                                // branchId: branchId,
                                                address:address,
                                                checkIn: checkIn,
                                                checkOut: checkOut,
                                            }
                                        }}>Login to book</Link>
                                    )
                                }
                                {/* </button> */}
                        </div>
                    </div>
                </section>
                <section className="mt-10 bg-white w-3/4 mx-auto rounded-xl pb-28 ">
                    <p className="ml-8 font-bold text-xl text-slate-700 pt-4">Rating & Review</p>
                    <div className="flex flex-col bg-gray-50 mx-4 mt-4  p-4 gap-2 border-2 rounded-xl shadow-xl">
                        {
                            evaluation.map(cm =>
                                <div className="flex gap-2 border-b-2 border-b-red-100">
                                    <div className=" bg-gray-200 w-16 h-14 rounded-full flex justify-center items-center">
                                        <Icon name="user" size="xl" />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <p className="font-bold text-slate-700"> {cm.username}</p>
                                        <div className="flex">
                                            {starInit.map(star => 
                                                    <div className={star <= cm.point ? "text-yellow-400" : "text-gray-400"}> <Icon name="star"/></div>
                                                )
                                            }
                                        </div>
                                        <p>{cm.create}</p>
                                        <p className="mb-4">{cm.content}</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="mt-10 mx-4">
                        {
                            starInit.map(star => 
                                <button 
                                    key={star}
                                    className={star <= value ? "text-yellow-400" : "text-gray-400"}
                                    onClick={() => setValue(star)}
                                >
                                    <Icon name="star" size="xl"/>
                                </button>
                            )
                        }
                    </div>
                    <div className="flex items-center gap-2">
                        <input className="mx-4 mt-4 flex-grow p-2 gap-2 border-2 rounded-xl" type="text" placeholder="Type your commnet ..."
                            onChange={(event:any) =>{
                                const value = event.target.value;
                                setContent(value);
                            }}
                            value={content}
                        />
                        <button className="text-white font-bold bg-cyan-600 hover:bg-cyan-900 mr-4 p-3 px-8 mt-4 rounded-xl"
                        onClick={requestSendEvaluation}
                        >
                            <Icon name="paper-plane" size="xl" /> SEND
                        </button>
                    </div>
                </section>
            </section>
        </>
        
    )
}