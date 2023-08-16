'use client';
import { IHomestays, getHomestaysClient } from "@/api/public";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import Image from "next/image";
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {


    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification(); 
    const searchParams = useSearchParams();
    const address = searchParams.get('address');
    const branchId = Number.parseInt(searchParams.get("branchId") ?? "0");
    const checkIn= searchParams.get('checkIn')?.toString() ?? "";
    const checkOut = searchParams.get('checkOut')?.toString() ?? "";
    const numPeople = Number.parseInt(searchParams.get('numPeople') ?? "1");
    console.log(checkIn,checkOut)

    const [homestays, setHometays] = useState<IHomestays[]>([]);

    useEffect(() => {
        if (branchId !== 0){
            fetchHomestays();
        }
    },[branchId,checkIn,checkOut,numPeople])

    const fetchHomestays = async () =>{
        try {
            showLoading();
            const {data} = await getHomestaysClient(branchId,checkIn,checkOut,numPeople);
            setHometays(data);
            notify("Here you are!","success");
        } catch (error) {
            if (axios.isAxiosError(error)){
                setHometays([]);
                notify(error.response?.data,"error");
            }
        }
        finally {
            hideLoading();
        }
    }


    return (
        <>
            <section className="bg-slate-300 h-screen">
            <Header />
            <Search branchIdParam={branchId} addressParam={address} checkInParam={checkIn} checkOutParam={checkOut} numParam={numPeople} />
                <div className="flex mt-10 gap-3 w-[1200px] h-screen mx-auto bg-gray-50 ">
                    <section className="flex-shrink-0 w-[300px] p-3 bg-gray-50 flex flex-col items-center">
                        <img className="w-40 h-40 mb-2 object-contain " src="/images/Flag-map_of_Vietnam.png" />
                        <p className="italic">{address}</p>
                    </section>
                    <section className="w-full flex flex-col gap-3 p-3 border-l-2 " >
                        {homestays.map((homestay) => (
                            <div className="flex items-start gap-3 w-full p-3 border rounded-md  shadow-lg">
                                <div className="relative flex-shrink-0 w-52 aspect-square">
                                    <Image
                                        className="object-fill rounded-2xl"
                                        src={homestay.images}
                                        alt="homestay-image"
                                        fill
                                    />
                                </div>
                                <div className="flex flex-col gap-4 w-full ml-2 ">
                                    <h2 className="text-2xl font-bold text-cyan-800">{homestay.name}</h2>
                                    <p>Number of people: {homestay.numPeople}</p>
                                    <p className="text-red-700 font-bold">Price: ${homestay.price}/night</p>
                                    <p className="text-gray-500" >Free private parking and a restaurant. This 4-star hotel offers a concierge service and a tour desk. The accommodation offers room service, a 24-hour front desk and currency exchange for guests.</p>
                                </div>
                                {/* <button className="px-6 py-3 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900 md:w-1/6 mt-auto" > */}
                                    <Link className="px-6 py-3 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900 md:w-1/6 mt-auto flex items-center justify-center"
                                        href={{
                                        pathname: `homestays/${homestay.homestayId}`,
                                        query: {
                                            // branchId: branchId,
                                            address:address,
                                            checkIn: checkIn,
                                            checkOut: checkOut,
                                        }
                                    }}>Details</Link>
                                {/* </button> */}
                            </div>
                        ))}
                    </section>
                </div>
            
            </section>
        </>
    )
}