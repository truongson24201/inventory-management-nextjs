'use client';
import { IRoleResponse, getAccountDetails, updateAccount } from "@/api/account";
import { IBranchResponse, getAllBranches } from "@/api/branch";
import { getAllRoles } from "@/api/role";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const accountId = Number.parseInt(params.id);
    const router = useRouter();
    const notifyPopup = useNotification();
    const [fields, setFields] = useState([
        {label: "Full Name", value: "fullName", icon: "map-location-dot", isRequired: true, errorText: ""},
        {label: "Email", value: "email", icon: "map-location-dot", isRequired: true, errorText: ""},
        {label: "Phone Number", value: "phoneNumber", icon: "map-location-dot", isRequired: true, errorText: ""},
    ]);
    const [status, setStatus] = useState("true");
    const [username, setUsername] = useState("");
    const [roles, setRoles] = useState<IDropdownData[]>([]);
    const [branches, setBranches] = useState<IDropdownData[]>([]);
    const [roleId, setRoleId] = useState(0);
    const [branchId, setbranchId] = useState(0);

    useEffect(() => {
        fetchBranch();
    }, []);

    async function fetchBranch() {
        try {
            showLoading();
            const {data} = await getAccountDetails(accountId);
            setFields([
                {...fields[0], value: data?.fullName ?? ""},
                {...fields[1], value: data?.email ?? ""},
                {...fields[2], value: data?.phoneNumber ?? ""},
            ]);
            setRoleId(data.roleId);
            setUsername(data.username ?? "") 
            const {data : roleRes} = await getAllRoles();
            setRoles(roleRes.map(role => ({
                text: role?.name ?? "", value: role?.id ?? 0
            })));
            const {data : branchRes} = await getAllBranches();
            setBranches(branchRes.map(branch => ({
                text: branch?.name ?? "", value: branch?.branchId ?? 0
            })));
            setbranchId(data && data.branchId !== null ? data.branchId : branchRes[0].branchId)
            setStatus(data && data.status === false ? "false" : "true")
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function updateThisAccount(){
        try {
            showLoading();
            await updateAccount(accountId,{
                branchId: branchId,
                fullName: fields[0].value,
                email: fields[1].value,
                phoneNumber: fields[2].value,
                status: status == "true" ? true : false,
                roleId: roleId,
            });
            router.push("./");
            notifyPopup("Edit successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notifyPopup("Update account failed!","error");
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
                        actionHandler={updateThisAccount}
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
                            text="Edit account information"
                            icon="pencil"
                        />
                        <form className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                            {/* <InfoBar label="Id" icon="hashtag" value={accountId} /> */}
                            <InfoBar label="username" icon="hashtag" value={username} />
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
                        <DropDown
                                label="status"
                                dataset={[
                                    {text: "Active", value: "true"},
                                    {text: "Block", value: "false"},
                                ]}
                                handleChange={e => setStatus(e.target.value)}
                                icon="user"
                                value={status}
                            />
                            <DropDown
                                label="Roles"
                                dataset={roles}
                                handleChange={e => setRoleId(Number.parseInt(e.target.value))}
                                icon="user"
                                value={roleId}
                            />
                            <DropDown
                                label="Branches"
                                dataset={branches}
                                handleChange={e => setbranchId(Number.parseInt(e.target.value))}
                                icon="user"
                                value={branchId}
                                disabled={roleId && (roleId === 1 || roleId === 2) ? true : false}
                            />
                        </form>
                    </section>
                </div>
            </Main>
        </section>
    )
}
