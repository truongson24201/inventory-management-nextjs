'use client';
import { IHomestayResponse } from "@/api/homestay";
import { getRoleDetails } from "@/api/role";
import {getFacilityDetails, gethomestaysInOf, IFacilityResponse, removeFacility} from "@/api/facility";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
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

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [homestays,setHomestays] = useState<IHomestayResponse[]>([])
    const [facility, setFacility] = useState<IFacilityResponse>({
        facilityId: 1,
        name:"",
    });

    const facilityId = Number.parseInt(params.id);
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();

    useEffect(() => {
        fetchFacility();
        fetchHomestays();
    }, []);

    async function fetchFacility() {
        try {
            showLoading();
            const {data: touristRes} = await getFacilityDetails(facilityId);
            setFacility(touristRes);facilityId
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function fetchHomestays() {
        try {
            showLoading();
            const {data: homestayRes} = await gethomestaysInOf(facilityId);
            setHomestays(homestayRes);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function removeThisFacility() {
        try {
            showLoading();
            await removeFacility(facilityId);
            router.push("./")
            notify("Remove facility successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove facility failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const removeFacilityPopup = 
        <Popup text="This facility will be remove, you're sure?">
            <Button
                text="Remove"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    removeThisFacility();
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
                        actionHandler={() => router.push(`${facilityId}/edit`)}
                    />
                    <Button
                        text="Remove"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(removeFacilityPopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection 
                        facility={facility}
                    />
                    <HomestaysSection homestays={homestays} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    facility,
}: {
    facility: IFacilityResponse,
}) {
    const inforBars: {label: string, key: "facilityId" | "name" , icon: string}[] = [
        // {label: "Id", key: "facilityId", icon: "hashtag"},
        {label: "Name", key: "name", icon: "signature"},
    ];
    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLUE}
            />
            <div className="relative w-full h-44">
                <Image
                    className="object-contain"
                    src="/images/facility.jpg"
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        label={infoBar.label}
                        value={facility?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}

function HomestaysSection({
    homestays
}: {
    homestays: IHomestayResponse[]
}) {
    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Homestays belong to this facility" icon="warehouse" color={Color.GREEN} />
            <Table
                columns={[
                    // {id: 1, text: "Id", key: "homestayId"},
                    {id: 2, text: "Name", key: "name"},
                    {id: 3, text: "Address", key: "numPeople"}, 
                    {id: 3, text: "Status", key: "status"}, 
                ]}
                dataSet={homestays}
            />
        </section>
    )
}