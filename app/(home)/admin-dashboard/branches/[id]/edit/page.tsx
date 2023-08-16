'use client';
import { getDistrits, getProvinces, getWards } from "@/api/address";
import { getBranchDetails, updateBracnh } from "@/api/branch";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import DropDown, { IDropdownData } from "@/components/DropDown";
import EditText from "@/components/EditText";
import InfoBar from "@/components/InfoBar";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const branchId = Number.parseInt(params.id);
    const router = useRouter();
    const notifyPopup = useNotification();
    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: ""},
        {label: "Map", value: "", icon: "map-location-dot", isRequired: true, errorText: ""},
    ]);

    const [status, setStatus] = useState("true");
    const [provinces, setProvinces] = useState<IDropdownData[]>([]);
    const [provinceId, setProvinceId] = useState(0);
    const [districts, setDistricts] = useState<IDropdownData[]>([]);
    const [districtId, setDistrictId] = useState(0);
    const [wards, setWards] = useState<IDropdownData[]>([]);
    const [wardId, setWardId] = useState(0);
    
    const [provinceDataset, setProvinceDataset] = useState<IDropdownData[]>([]);
    const [districtDataset, setDistrictDataset] = useState<IDropdownData[]>([]);
    const [wardDataset, setWardDataset] = useState<IDropdownData[]>([]);


    useEffect(() => {
        fectProvinces();
    }, []);

    useEffect(() => {
        if (provinceId){
            fectDistricts(provinceId);
        }
    }, [provinceId]);

    useEffect(() => {
        if (districtId){
            fectWards(districtId);
        }
    }, [districtId]);

    useEffect(() => {
        fetchBranch();
    }, []);

    async function fetchBranch() {
        try {
            showLoading();
            const {data} = await getBranchDetails(branchId);
            setFields([
                {...fields[0], value: data?.name ?? ""},
                {...fields[1], value: data?.mapLocation ?? ""},
            ])
            setProvinceId(data.province.provinceId)
            setDistrictId(data.district.districtId)
            setWardId(data.ward.wardId)
            setStatus(data && data.status === false ? "false" : "true")


        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }
    const fectProvinces = async () => {
        try {
            const {data} = await getProvinces();
            setProvinceDataset(data.map(item => ({
                text: item?.name ?? "",
                value: item?.provinceId ?? 0
            })))
            // if (data?.[0]?.provinceId) {
            //     setProvinceId(data[0].provinceId);
            // }
        }
        catch (error) {
            console.log(error);
        }
    }

    const fectDistricts = async (provinceId:any) => {
        try {
            const {data} = await getDistrits(provinceId);
            setDistrictDataset(data.map(item => ({
                text: item?.name ?? "",
                value: item?.districtId ?? 0
            })))
            const {data:wardRes} = await getWards(data[0].districtId);
            setWardDataset(wardRes.map(item => ({
                text: item?.name ?? "",
                value: item?.wardId ?? 0
            })))
            setDistrictId(data[0].districtId);
            setWardId(wardRes[0].wardId);
            // if (data?.[0]?.districtId) {
            //     setDistrictId(data[0].districtId);
            // }
        }
        catch (error) {
            console.log(error);
        }
    }

    const fectWards = async (districtId:any) => {
        try {
            const {data} = await getWards(districtId);
            setWardDataset(data.map(item => ({
                text: item?.name ?? "",
                value: item?.wardId ?? 0
            })))
            // if (data?.[0]?.wardId) {
            //     setWardId(data[0].wardId);
            // }
        }
        catch (error) {
            console.log(error);
        }
    }

    async function updateThisBranch() {
        try {
            showLoading();
            await updateBracnh(branchId,{
                name:fields[0].value,
                mapLocation:fields[1].value,
                districtId:districtId,
                provinceId:provinceId,
                wardId:wardId,
                status: status == "true" ? true : false,
            });
            router.push("./");
            notifyPopup("Edit successfully!", "success");
        }catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)){
                notifyPopup(error.response?.data, "error");
            }
            // notifyPopup("Update account failed!","error");
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
                        actionHandler={updateThisBranch}
                    /> 
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex justify-between gap-5">
                    <section className="relative w-1/2 flex place-content-center">
                        <Image 
                            className="object-fill"
                            src="/images/branch-edit.jpg"
                            alt="Branch images"
                            fill
                        />
                    </section>
                    <section className="w-1/2 border-2 flex flex-col p-5 rounded-md">
                        <Title
                            text="Edit branch information"
                            icon="pencil"
                        />
                        <form className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                            {/* <InfoBar label="Id" icon="hashtag" value={branchId} /> */}
                            {fields.map((field, idx) => 
                            <EditText
                                icon={field.icon}
                                label={field.label}
                                value={field.value}
                                handleChange={(e) => {
                                    setFields([
                                        ...fields.slice(0, idx),
                                        {
                                            ...field,
                                            value: e.target.value,
                                        },
                                        ...fields.slice(idx + 1)
                                    ]);

                                    console.log(fields.slice(0, idx));
                                    console.log(fields.slice(idx + 1));
                                }}
                                errorText={field.errorText}
                                key={field.label + field.errorText}
                            />
                        )}
                        <a className="flex ml-10 items-center" href="https://www.google.com/maps/@16.5682839,104.7657486,6.04z?hl=vi-VN&entry=ttu" target="_blank">
                                {/* <a href="google.com">Go to Google MAP</a> */}
                                Google Map
                        </a>
                        <DropDown
                                label="status"
                                dataset={[
                                    {text: "Active", value: "true"},
                                    {text: "Block", value: "false"},
                                ]}
                                handleChange={e => setStatus(e.target.value)}
                                icon="flag"
                                value={status}
                            />
                        <DropDown
                            label="Provinces"
                            dataset={provinceDataset}
                            handleChange={e => setProvinceId(Number.parseInt(e.target.value))}
                            icon="p"
                            value={provinceId}
                        />
                        <DropDown
                            label="Districts"
                            dataset={districtDataset}
                            handleChange={e => setDistrictId(Number.parseInt(e.target.value))}
                            icon="d"
                            value={districtId}
                        />
                        <DropDown
                            label="Wards"
                            dataset={wardDataset}
                            handleChange={e => setWardId(Number.parseInt(e.target.value))}
                            icon="w"
                            value={wardId}
                        />
                        </form>
                    </section>
                </div>
            </Main>
        </section>
    )
}
