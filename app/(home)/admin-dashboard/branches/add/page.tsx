'use client'
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import EditText from "@/components/EditText";
import Header, { Button } from "@/layouts/DashboardHeader"
import Main from "@/layouts/DashboardMain"
import { Color } from "@/utils/constants/colors"
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import useNotification from "@/utils/hooks/useNotification";
import { createBranch } from "@/api/branch";
import { getDistrits, getProvinces, getWards } from "@/api/address";
import Link from "next/link";
import DropDown from "@/components/DropDown";
import axios from "axios";
 
export default function Page() {
    const router = useRouter();
    const notify = useNotification();  
    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: ""},
        {label: "Map", value: "", icon: "map-location-dot", isRequired: true, errorText: ""},

    ])

    const [provinceDataset, setProvinceDataset] = useState<{text: string, value: string | number}[]>([]);
    const [provinceId, setProvinceId] = useState(0);
    const [districtDataset, setDistrictDataset] = useState<{text: string, value: string | number}[]>([]);
    const [districtId, setDistrictId] = useState(0);
    const [wardDataset, setWardDataset] = useState<{text: string, value: string | number}[]>([]);
    const [wardId, setWardId] = useState(0);

    useEffect(() => {
        fectProvinces();
    }, []);

    useEffect(() => {
        fectDistricts();
    }, [provinceId]);

    useEffect(() => {
        fectWards();
    }, [districtId]);
    
    const fectProvinces = async () => {
        try {
            const {data} = await getProvinces();
            setProvinceDataset(data.map(item => ({
                text: item?.name ?? "",
                value: item?.provinceId ?? 0
            })))
            if (data?.[0]?.provinceId) {
                setProvinceId(data[0].provinceId);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const fectDistricts = async () => {
        try {
            const {data} = await getDistrits(provinceId);
            setDistrictDataset(data.map(item => ({
                text: item?.name ?? "",
                value: item?.districtId ?? 0
            })))
            if (data?.[0]?.districtId) {
                setDistrictId(data[0].districtId);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const fectWards = async () => {
        try {
            const {data} = await getWards(districtId);
            setWardDataset(data.map(item => ({
                text: item?.name ?? "",
                value: item?.wardId ?? 0
            })))
            if (data?.[0]?.wardId) {
                setWardId(data[0].wardId);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
    }, []);
    
    const requestCreateBranch = async () => {
        const checked = checkConstraint();
        if (!checked) {
            notify("Create a branch failed", "error");
            return;
        }
        try {
            const name = fields[0].value
            const mapLocation = fields[1].value
            await createBranch({name,mapLocation,provinceId,districtId,wardId});
            router.push("./");
            notify("Create a branch successfully", "success");
        }
        catch (error) {
            if (axios.isAxiosError(error)){
                notify(error.response?.data, "error");
            }
        } 
    }

    function checkConstraint() {
        let isError = false;
        let errors: string[] = [];

        fields.forEach(field => {
            const checkErrorValue = field.isRequired && !field.value;
            if (checkErrorValue) {
                errors.push("Cannot blank this field");
                isError = true;
            }
            else errors.push("");
        });

        setFields(fields.map((field, idx) => ({
            ...field,
            errorText: errors[idx],
        })));
        return !isError;
    } 

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button 
                        text="Save"
                        color={Color.WHITE}
                        bgColor={Color.GREEN} 
                        actionHandler={requestCreateBranch}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-[480px] h-full flex flex-col gap-8 p-5 mx-auto border-2 rounded-md shadow-md">
                    <Title
                        text="Create a branch"
                        icon="plus"
                        color={Color.GREEN}
                    />
                    {/* <div className="relative h-60">
                        <Image
                            className="object-cover"
                            src="/images/branch-create2.jpg"
                            alt="Building image"
                            fill
                        />
                    </div> */}
                    <form className="flex flex-col gap-4">
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
                                }}
                                errorText={field.errorText}
                                key={field.label + field.errorText}
                            />
                        )}
                        <a className="flex  ml-10  items-center" href="https://www.google.com/maps/@16.5682839,104.7657486,6.04z?hl=vi-VN&entry=ttu" target="_blank">
                                {/* <a href="google.com">Go to Google MAP</a> */}
                                Google Map
                        </a>
                        <DropDown
                            label="Province"
                            dataset={provinceDataset}
                            handleChange={e => setProvinceId(Number.parseInt(e.target.value))}
                            icon="p"
                            value={provinceId}
                        />
                        <DropDown
                            label="District"
                            dataset={districtDataset}
                            handleChange={e => setDistrictId(Number.parseInt(e.target.value))}
                            icon="d"
                            value={districtId}
                        />
                        <DropDown
                            label="Ward"
                            dataset={wardDataset}
                            handleChange={e => setWardId(Number.parseInt(e.target.value))}
                            icon="w"
                            value={wardId}
                        />
                    </form>
                </div>
            </Main>
        </section>
    )
}