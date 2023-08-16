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
  

export default function Page() {
    const router = useRouter();
    const notify = useNotification();  
    const [fields, setFields] = useState([
        {label: "Username", value: "", icon: "signature", isRequired: true, errorText: ""},
        {label: "Full name", value: "", icon: "id-card-clip", isRequired: true, errorText: ""},
        {label: "Email", value: "", icon: "at", isRequired: false, errorText: ""},
        {label: "Phone Number", value: "", icon: "phone", isRequired: false, errorText: ""},

    ]);
    const [roleDataset, setRoleDataset] = useState<{text: string, value: string | number}[]>([]);
    const [roleId, setRoleId] = useState(0);

    useEffect(() => {
        fetchRoles();
    }, []);
    
    const fetchRoles = async () => {
        try {
            const {data} = await getAllRoles();
            setRoleDataset(data.map(item => ({
                text: item?.name ?? "",
                value: item?.id ?? 0
            })))
            if (data?.[0]?.id) {
                setRoleId(data[0].id);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const requestCreateAccount = async () => {
        const checked = checkConstraint();
        if (!checked) {
            notify("Create a account failed", "error");
            return;
        }
        try {
            await createAccount(fields[0].value,fields[1].value,fields[2].value,fields[3].value, roleId);
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
                        actionHandler={requestCreateAccount}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-[480px] h-full flex flex-col gap-8 p-5 mx-auto border-2 rounded-md shadow-md">
                    <Title
                        text="Create an account"
                        icon="plus"
                        color={Color.GREEN}
                    /> 
                    <form className="flex flex-col gap-4">
                        <DropDown
                            label="Role"
                            dataset={roleDataset}
                            handleChange={e => setRoleId(Number.parseInt(e.target.value))}
                            icon="user"
                            value={roleId}
                        />
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