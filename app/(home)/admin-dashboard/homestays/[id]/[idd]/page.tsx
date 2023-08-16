'use client';
import { IHomestayResponse, IImagesResponse, getHomestayDetails, getImages, removeHomestay } from "@/api/homestay";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import DeleteButton from "@/components/DeleteButton";
import Icon from "@/components/Icon";
import InfoBar from "@/components/InfoBar";
import Popup from "@/components/Popup";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InfoSection from "./InfoSection";
import ImagesSection from "./ImageSection";
import FacilitiesSection from "./FacilititySection";
import PricesSection from "./PriceSection";

export default function Page({
    params
}: {
    params: {idd: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();

    const homestayId = Number.parseInt(params.idd);
    const [homestay, setHomestay] = useState<IHomestayResponse>({
        homestayId: 1,
        name:"",
        numPeople:0,
        status:"",
        updateOn: "",
        updateBy: "",
    });
    const [section, setSection] = useState<"images" | "facilities" | "prices">("images");


    useEffect(() => {
        fetchHomestay();
    }, []);


    async function fetchHomestay() {
        try {
            showLoading();
            const {data: homestayRes} = await getHomestayDetails(homestayId);
            setHomestay(homestayRes);
        
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function removeThisHomestay() {
        try {
            showLoading();
            await removeHomestay(homestayId);
            router.push("./")
            notify("Remove homestay successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove homestay failed!", "error");
        }
        finally {
            hideLoading();
        }
    }



    const removeHomestayPopup = 
        <Popup text="This homestay will be REMOVE or SHUTDOWN, you're sure?">
            <Button
                text="[Remove/Shutdown]"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    removeThisHomestay();
                }}
            />
            <Button
                text="Cancel"
                color={Color.BLACK}
                bgColor={Color.WHITE} 
                actionHandler={() => {popup.hide()}}
            />
        </Popup>; 
    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Edit"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE} 
                        actionHandler={() => router.push(`${homestayId}/edit`)}
                    />
                    <Button
                        text="Remove"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(removeHomestayPopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection 
                        homestay={homestay}
                    />
                    {/* <WarehousesSection warehouses={warehouses} /> */}
                    <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
                        <div className="flex gap-4">
                            <Button
                                text=" Images"
                                color={Color.WHITE}
                                bgColor={Color.BLUE}
                                icon="images"
                                actionHandler={() => {
                                    setSection("images")
                                }}
                            />
                            <Button
                                text=" Facilities"
                                color={Color.WHITE}
                                bgColor={Color.GREEN} 
                                icon="house-signal"
                                actionHandler={() => {
                                    setSection("facilities")
                                }}
                            />
                            <Button
                                text=" Prices"
                                color={Color.WHITE}
                                bgColor={Color.RED} 
                                icon="money-check-dollar"
                                actionHandler={() => {
                                    setSection("prices")
                                }}
                            />
                        </div>
                        {
                            section === "images" 
                            ? <ImagesSection homestayId={homestayId} />
                            : section === "facilities"
                            ? <FacilitiesSection homestayId={homestayId} />
                            : <PricesSection homestayId={homestayId} />
                        }
                    </section>
                </div>
            </Main>
        </section>
    )
}

