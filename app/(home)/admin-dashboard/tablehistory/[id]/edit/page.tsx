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
    params: {id: string}
    ,
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const tableHistoryId = Number.parseInt(params.id);
    const router = useRouter();
    const notifyPopup = useNotification();

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Save changes"
                        color={Color.WHITE}
                        bgColor={Color.BLUE} 
                        actionHandler={()=>{}}
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
                    </section>
                </div>
            </Main>
        </section>
    )
}
