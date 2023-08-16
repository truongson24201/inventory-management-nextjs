'use client';
import { getTouristDetails, updateTourist } from "@/api/tourist";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import EditText from "@/components/EditText";
import InfoBar from "@/components/InfoBar";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
    params
}: {
    params: {id: string}
}){
    const [showLoading, hideLoading] = useLoadingAnimation();
    const touristId = Number.parseInt(params.id);
    const router = useRouter();
    const notifyPopup = useNotification();
    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: ""},
    ]);

    useEffect(() => {
        fetchTourist();
    }, []);

    async function fetchTourist() {
        try {
            showLoading();
            const {data} = await getTouristDetails(touristId);
            setFields([
                {...fields[0], value: data?.name ?? ""},
            ])
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function updateThisTourist() {
        try {
            showLoading();
            await updateTourist(touristId,fields[0].value)
            router.push("./");
            notifyPopup("Edit successfully!", "success");
        }catch (error) {
            console.log(error);
            notifyPopup("Update failed!","error");
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
                        actionHandler={updateThisTourist}
                    /> 
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex justify-between gap-5">
                    <section className="relative w-1/2 flex place-content-center">
                        <Image
                            className="object-fill"
                            src="/images/tourist.jpg"
                            alt="Branch images"
                            fill
                        />
                    </section>
                    <section className="w-1/2 border-2 flex flex-col p-5 rounded-md">
                        <Title
                            text="Edit Tourist information"
                            icon="pencil"
                        />
                        <form className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                            {/* <InfoBar label="Id" icon="hashtag" value={touristId} /> */}
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
                        </form>
                    </section>
                </div>
            </Main>
        </section>
    )


}