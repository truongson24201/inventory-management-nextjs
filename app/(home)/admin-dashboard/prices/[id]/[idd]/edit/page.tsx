'use client';
import { getDistrits, getProvinces, getWards } from "@/api/address";
import { getBranchDetails, updateBracnh } from "@/api/branch";
import { IHomestayResponse, getHomestayDetails, getStatus, updateHomestay } from "@/api/homestay";
import { IPricesResponse, getPriceDetails, updatePrice } from "@/api/price";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import DropDown, { IDropdownData } from "@/components/DropDown";
import EditText from "@/components/EditText";
import InfoBar from "@/components/InfoBar";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import { getCurrentDateFormatted } from "@/utils/functions/dateFormet";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
    params,
}: {
    params: {idd: string}
    ,
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const pricelistId = Number.parseInt(params.idd);
    const router = useRouter();
    const notifyPopup = useNotification();

    const [price, setPrice] = useState<IPricesResponse>({
        pricelistId: 1,
        effectiveDate:"",
        updateOn: "",
        updateBy: "",
    });

    const [newPrice, setNewPrice] = useState({
        label: "Effective New", 
        value: getCurrentDateFormatted(), 
        icon: "clock-rotate-left", 
        isRequired: true, 
        errorText: "" , 
        type: "date"
    });


    useEffect(() => {
        fetchPrice();
    }, []);

    async function fetchPrice() {
        try {
            showLoading();
            const {data: priceRes} = await getPriceDetails(pricelistId);
            setPrice(priceRes);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }
        
    
    async function updateThisHomestay() {
        try {
            showLoading();
            await updatePrice(pricelistId,newPrice.value);
            router.push("./");
            notifyPopup("Edit successfully!", "success");
        }catch (error) {
            if (axios.isAxiosError(error)){
                notifyPopup(error.response?.data, "error");
            }
        }
        finally {
            hideLoading();
        }
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Save changes"
                        color={Color.WHITE}
                        bgColor={Color.BLUE} 
                        actionHandler={updateThisHomestay}
                    /> 
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex justify-between gap-5">
                    <section className="relative w-1/2 flex place-content-center">
                        <Image 
                            className="object-fill"
                            src="/images/pricesList.png"
                            alt="Branch images"
                            fill
                        />
                    </section>
                    <section className="w-1/2 border-2 flex flex-col p-5 rounded-md">
                        <Title
                            text="Edit Effective Date to Price List"
                            icon="pencil"
                        />
                        <form className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                            {/* <InfoBar label="Id" icon="hashtag" value={pricelistId} /> */}
                            <InfoBar label="Effective Old" icon="clock" value={price.effectiveDate} />
                            <EditText
                                icon={newPrice.icon}
                                label={newPrice.label}
                                value={newPrice.value}
                                type={newPrice.type}
                                handleChange={(e) => { 
                                    setNewPrice({
                                        ...newPrice,
                                        value: e.target.value
                                    }); 
                                    console.log(e.target.value)
                                }}
                                errorText={newPrice.errorText} 
                            />
                        </form>
                    </section>
                </div>
            </Main>
        </section>
    )
}
