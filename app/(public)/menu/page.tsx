'use client';
import { getAllNow } from "@/api/menu";
import { IPriceMenuItemView } from "@/api/response";
import Header from "@/components/Header";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {


    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification();

    const [menus, setMenus] = useState<IPriceMenuItemView[]>([]);

    useEffect(() => {
        fetAllMenuNow();
    }, [])

    const fetAllMenuNow = async () => {
        try {
            showLoading();
            const { data } = await getAllNow();
            setMenus(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                notify(error.response?.data, "error");
            }
        }
        finally {
            hideLoading();
        }
    }


    return (
        <>
            <section className="bg-slate-300 h-screen overflow-hidden">
                
                <Header />
                <div className="flex mt-10 gap-3 w-[1200px] h-screen mx-auto bg-gray-50 ">
                    <section className="flex-shrink-0 w-[300px] p-3 bg-gray-50 flex flex-col items-center">
                        <img className="w-40 h-40 mb-2 object-contain " src="/images/Flag-map_of_Vietnam.png" />
                        <p className="italic">97 Man Thien, Hiep Phu, Tp.Thu Duc, Tp Ho Chi Minh</p>
                    </section>
                    <section className="w-full flex flex-col gap-3 p-3 border-l-2 overflow-y-auto" >
                        {menus.map((menu) => (
                            <div className="flex items-start gap-3 w-full p-3 border rounded-md  shadow-lg">
                                <div className="relative flex-shrink-0 w-52 aspect-square">
                                    <Image
                                        className="object-fill rounded-2xl"
                                        src={menu.menuItem.imageUrl}
                                        alt="homestay-image"
                                        fill
                                    />
                                </div>
                                <div className="flex flex-col gap-4 w-full ml-2 ">
                                    <h2 className="text-2xl font-bold text-cyan-800">{menu.menuItem.menuItemName}</h2>
                                    <p>Category: {menu.menuItem.menuItemCategory.menuItemCategoryName}</p>
                                    <p className="text-red-700 font-bold">Price: {menu.price.toLocaleString()} VND</p>
                                    <p className="text-gray-500" >{menu.menuItem.description}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>

            </section>
        </>
    )
}