'use client';
import { IBranchResponse, addTouristInOf, deleteTouristOutOf, getBranchDetails, getTourstsCombobox, getTourstsOf, removeBranch } from "@/api/branch";
import { getRoleDetails } from "@/api/role";
import { ITouristResponse, removeTourist } from "@/api/tourist";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import DropDown, { IDropdownData } from "@/components/DropDown";
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
import { AxiosError } from "axios";
import { Console } from "console";
import { Erica_One } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page({
    params
}: {
    params: {id: string}
}) {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const [branch, setBranch] = useState<IBranchResponse>({
        branchId: 1,
        name:"",
        mapLocation:"",
        status: true,
        province:{
            provinceId:1,
            name:""
        },
        district:{
            districtId:1,
            name:""
        },
        ward:{
            wardId:1,
            name:""
        },
    });

    
    // const [touristId, setTouristId] = useState(0);
    const branchId = Number.parseInt(params.id);
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();

    useEffect(() => {
        fetchtBranch();
    }, []);

    async function fetchtBranch() {
        try {
            showLoading();
            const {data: branchRes} = await getBranchDetails(branchId);
            setBranch(branchRes);
            
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function deleteThisBranch() {
        try {
            showLoading();
            await removeBranch(branchId);
            router.push("./")
            notify("Remove branch successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove branch failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const removeBranchPopup = 
        <Popup text="This branch will be block, you're sure?">
            <Button
                text="Remove"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    deleteThisBranch();
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
                        actionHandler={() => router.push(`${branchId}/edit`)}
                    />
                    <Button
                        text="Remove"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(removeBranchPopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection 
                        branch={branch}
                    />
                    <TouristSection 
                        branchId={branchId}
                        
                    />
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    branch,
}: {
    branch: IBranchResponse,
}) {
    const inforBars: {label: string, key: "branchId" | "name" | "mapLocation"  | "province" | "district" | "ward" , icon: string}[] = [
        // {label: "Id", key: "branchId", icon: "hashtag"},
        {label: "Name", key: "name", icon: "signature"},
        // {label: "Map", key: "mapLocation", icon: "map-location-dot"},
        // {label: "Status", key: "status", icon: "map-location-dot"},
        {label: "Province", key: "province", icon: "p"},
        {label: "District", key: "district", icon: "d"},
        {label: "Ward", key: "ward", icon: "w"},
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
                    src="/images/branch.jpg"
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        label={infoBar.label}
                        value={
                            (infoBar.key === "province" || infoBar.key === "district" || infoBar.key === "ward" ? branch[infoBar.key].name : branch[infoBar.key])
                        }
                        // value={branch.key}
                        icon={infoBar.icon}
                    />
                )}
                <InfoBar
                    label={"Status"}
                    value={branch?.status ? "Active" : "Block"}
                    icon={"circle-info"}
                />
                <a className="flex ml-4 items-center text-center justify-start" href={branch.mapLocation} target="_blank">
                    <Icon name="location-dot" size="xl" /> 
                    <div className="p-2 text-lg">
                        Google Map
                    </div>
                </a>
            </div>
        </section>
    )
}

function TouristSection({
    branchId,
}: {
    branchId:number,
}) {
    
    const [touristDropDown, setTouristDropDown] = useState<IDropdownData[]>([]);
    const [tourists, setTourists] = useState<ITouristResponse[]>([]);
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [touristId, setTouristId] = useState(0);
    const popup = usePopup();
    const notify = useNotification();
    const router = useRouter();

    useEffect(() => {
        fetchTourists();
    }, []); 

    const removeThisTouristOutOf = async (id: number) => {
        // popup.hide();
        try {
            showLoading();
            const {data} = await deleteTouristOutOf(branchId,id);
            setTourists(tourists.filter(t => t.touristId != id));
            const newDropdown = [
                ...touristDropDown,
                {
                    text: data.name ?? "",
                    value: data.touristId + "" ,
                }
            ];
            setTouristDropDown(newDropdown);
            newDropdown?.[0] && setTouristId(Number.parseInt(newDropdown[0].value + ""));
            notify("REMOVE successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove failed", "error");
        }
        finally {
            hideLoading();
        }
    }

    async function addThisTouristInOf() {
        try {
            showLoading();
            const {data : newT} =  await addTouristInOf(branchId,touristId);
            // router.push("./")
            // fectTouristsDropDown();
            tourists.push(newT);
            const newDropdodwn = touristDropDown.filter(dd => dd.value != touristId)
            setTouristDropDown(newDropdodwn);
            newDropdodwn?.[0] && setTouristId(Number.parseInt(newDropdodwn[0].value + ""));
            notify("ADD successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Add tourist into this branch failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    async function fetchTourists() {
        try {
            showLoading();
            const {data: touristsRes} = await getTourstsOf(branchId);
            setTourists(touristsRes);
            let {data: touristsDropRes} = await getTourstsCombobox(branchId);
            touristsDropRes.filter(dd => !touristsRes.includes(dd));
            setTouristDropDown(touristsDropRes.map(tourist => ({
                text: tourist?.name ?? "", value: tourist?.touristId ?? 0
            })));
            setTouristId(touristsDropRes[0].touristId);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }


    const deleteBtn = 
        <button className="w-10 h-10 text-white bg-red-600 rounded-md hover:bg-opacity-80">
            <Icon
                name="trash"
                size="lg"
            />
        </button>

    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Tourists belong to this branch" icon="warehouse" color={Color.GREEN} />
                <div className="flex gap-4">
                    <DropDown
                            label="tourists"
                            dataset={touristDropDown}
                            handleChange={e => setTouristId(Number.parseInt(e.target.value))}
                            icon="user"
                            value={touristId}
                        />
                    <Button
                        text="Add"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE} 
                        actionHandler={() => {
                            addThisTouristInOf();
                        }}
                    />
                </div>
            <Table
                //    linkRoot = ""
                //    keyLink = ""
                columns={[
                    // {id: 1, text: "Id", key: "touristId"},
                    {id: 1, text: "Name", key: "name"},
                ]}
                dataSet={tourists}
                extra={{
                    column: {id: 3, text: "Functions"},
                    node: deleteBtn,
                    handleClick: (id: number) => {
                        removeThisTouristOutOf(id);
                        // popup.show(
                        //     <Popup text="This tourist will be remove out of branch, you're sure?">
                        //         <Button
                        //             text="Remove"
                        //             color={Color.WHITE}
                        //             bgColor={Color.RED} 
                        //             actionHandler={() => }
                        //         />
                        //         <Button
                        //             text="Cancel"
                        //             color={Color.BLACK}
                        //             bgColor={Color.WHITE} 
                        //             actionHandler={() => {popup.hide()}}
                        //         />
                        //     </Popup>
                        // )
                    },
                    key: "touristId"
                }}
            />
        </section>
    )
}

