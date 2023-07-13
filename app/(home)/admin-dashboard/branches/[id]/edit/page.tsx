'use client';
import { BranchResponse, getBranchById, updateBranch } from "@/api/branch";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import EditInput from "@/components/EditInput";
import InfoBar from "@/components/InfoBar";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useActiveNav from "@/utils/hooks/useActiveNav";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [_, setActiveNav] = useActiveNav();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const branchId = Number.parseInt(params.id);
    const router = useRouter();
    const notifyPopup = useNotification();
    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: ""},
        {label: "Address", value: "", icon: "map-location-dot", isRequired: true, errorText: ""},
    ]);

    useEffect(() => {
        setActiveNav("Branches");
        fetchBranch();
    }, []);

    async function fetchBranch() {
        try {
            showLoading();
            const {data} = await getBranchById(branchId);
            setFields([
                {...fields[0], value: data.name},
                {...fields[1], value: data.address},
            ])
        }
        catch (error) {
            console.log(error);
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
                        actionHandler={() => {
                            updateBranch(branchId, fields[0].value, fields[1].value);
                            router.push("./");
                            notifyPopup("Edit successfully!", "success");
                        }}
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
                        <div className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                            <InfoBar label="Id" icon="hashtag" value="1" />
                            {fields.map((field, idx) => 
                            <EditInput
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
                        </div>
                    </section>
                </div>
            </Main>
        </section>
    )
}
