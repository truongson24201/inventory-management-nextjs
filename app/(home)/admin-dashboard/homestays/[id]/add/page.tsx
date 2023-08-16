'use client'
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import EditText from "@/components/EditText";
import Header, { Button } from "@/layouts/DashboardHeader"
import Main from "@/layouts/DashboardMain"
import { Color } from "@/utils/constants/colors"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useNotification from "@/utils/hooks/useNotification";
import { getAllRoles } from "@/api/role";
import DropDown from "@/components/DropDown";
import { createAccount } from "@/api/account";
import { createHomestay } from "@/api/homestay";
  

export default function Page({
    params
}: {
    params: {id: string}
}) {

    const router = useRouter();
    const notify = useNotification();  
    const [fields, setFields] = useState([
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: ""},
        {label: "Num People", value: "", icon: "arrow-up-9-1", isRequired: true, errorText: ""},
    ]);
    const branchId = Number.parseInt(params.id);
    console.log(branchId);
    
    useEffect(() => {
    }, []);
    

    const requestCreateHomestay = async () => {
        const checked = checkConstraint();
        if (!checked) {
            notify("Create a account failed", "error");
            return;
        }
        try {
            await createHomestay(branchId,fields[0].value,Number.parseInt(fields[1].value));
            router.push("./");
            notify("Create a account successfully", "success");
        }
        catch (error) {
            console.log(error);
            notify("Create a account failed", "error");
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
                        actionHandler={requestCreateHomestay}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-[480px] h-full flex flex-col gap-8 p-5 mx-auto border-2 rounded-md shadow-md">
                    <Title
                        text="Create a homestay"
                        icon="plus"
                        color={Color.GREEN}
                    /> 
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
                    </form>
                </div>
            </Main>
        </section>
    )
}