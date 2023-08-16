'use client';
import { getRoleDetails } from "@/api/role";
import { ITouristResponse, getTouristDetails, removeTourist , IBranchesTourist, getBranchesOf} from "@/api/tourist";
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
    const [branches,setBranches] = useState<IBranchesTourist[]>([])
    const [tourist, setTourist] = useState<ITouristResponse>({
        touristId: 1,
        name:"",
    });

    const touristId = Number.parseInt(params.id);
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();

    useEffect(() => {
        fetchTourist();
        fetchBranchesOf();
    }, []);

    async function fetchTourist() {
        try {
            showLoading();
            const {data: touristRes} = await getTouristDetails(touristId);
            setTourist(touristRes);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function fetchBranchesOf() {
        try {
            showLoading();
            const {data: branchesRes} = await getBranchesOf(touristId);
            setBranches(branchesRes);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function deleteThisTourist() {
        try {
            showLoading();
            await removeTourist(touristId);
            router.push("./")
            notify("Remove tourist successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove tourist failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const deleteAccountPopup = 
        <Popup text="This tourist will be block, you're sure?">
            <Button
                text="Remove"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    deleteThisTourist();
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
                        actionHandler={() => router.push(`${touristId}/edit`)}
                    />
                    <Button
                        text="Remove"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(deleteAccountPopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection 
                        tourist={tourist}
                    />
                    <BranchesSelection branches={branches} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    tourist,
}: {
    tourist: ITouristResponse,
}) {
    const inforBars: {label: string, key: "touristId" | "name" , icon: string}[] = [
        // {label: "Id", key: "touristId", icon: "hashtag"},
        {label: "Username", key: "name", icon: "signature"},
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
                    src="/images/tourist.jpg"
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        label={infoBar.label}
                        value={tourist?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}

function BranchesSelection({
    branches
}: {
    branches: IBranchesTourist[]
}) {
    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Branches belong to this tourist" icon="warehouse" color={Color.GREEN} />
            <Table
                linkRoot="../branches/"
                keyLink="branchId"
                columns={[
                    // {id: 1, text: "Id", key: "branchId", linkRoot: "../branches/" },
                    {id: 2, text: "Name", key: "name"},
                    {id: 3, text: "Address", key: "address"}, 
                    {id: 3, text: "Status", key: "status"}, 
                ]}
                dataSet={branches}
            />
        </section>
    )
}