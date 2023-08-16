'use client';
import { IAccountResponse, IRoleResponse, getAccountDetails, getAllAccounts, removeAccount } from "@/api/account";
import { IBranchResponse, getBranchDetails } from "@/api/branch";
import { getRoleDetails } from "@/api/role";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import Popup from "@/components/Popup";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
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
    const [account, setAccount] = useState<IAccountResponse>({
        accountId: 1,
        username:"",
        fullName:"",
        email:"",
        phoneNumber:"",
        status: true,
        roleId: 0,
        branchId: 0
    });
    const [role, setRole] = useState<IRoleResponse>();
    const [branch, setBranch] = useState<IBranchResponse>();

    console.log(params.id)
    const accountId = Number.parseInt(params.id);
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();

    useEffect(() => {
        fetchtAccount();
    }, []);

    async function fetchtAccount() {
        try {
            showLoading();
            const {data: accountRes} = await getAccountDetails(accountId);
            setAccount(accountRes);
            const {data: roleRes} = await getRoleDetails(accountRes?.roleId ?? 0);
            setRole(roleRes);
            if (accountRes.branchId !== null){
                const {data: branchRes} = await getBranchDetails(accountRes?.branchId ?? 0);
                setBranch(branchRes);
            }
        
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function deleteThisAccount() {
        try {
            showLoading();
            await removeAccount(accountId);
            router.push("./")
            notify("Block account successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Block account failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    const deleteAccountPopup = 
        <Popup text="This account will be block, you're sure?">
            <Button
                text="Block"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    deleteThisAccount();
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
                        actionHandler={() => router.push(`${accountId}/edit`)}
                    />
                    <Button
                        text="Block"
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
                        account={account}
                        branch={branch}
                        role={role ?? {}}
                    />
                    {/* <WarehousesSection warehouses={warehouses} /> */}
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    account,
    branch,
    role,
}: {
    account: IAccountResponse,
    branch?: IBranchResponse,
    role: IRoleResponse
}) {
    const inforBars: {label: string, key: "accountId" | "username" | "fullName" | "email" | "phoneNumber" | "roleId" | "branchId", icon: string}[] = [
        // {label: "Id", key: "accountId", icon: "hashtag"},
        {label: "Username", key: "username", icon: "signature"},
        {label: "Full Name", key: "fullName", icon: "map-location-dot"},
        {label: "Email", key: "email", icon: "map-location-dot"},
        {label: "Phone Number", key: "phoneNumber", icon: "map-location-dot"},
    ];
    console.log(account.status)
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
                        value={account?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
                <InfoBar
                    label={"Status"}
                    value={account?.status ? "Active" : "Block"}
                    icon={""}
                />
                <InfoBar
                    label={"Branch"}
                    value={branch?.name ?? ""}
                    icon={""}
                />
                <InfoBar
                    label={"Role"}
                    value={role?.name ?? ""}
                    icon={""}
                />
            </div>
        </section>
    )
}

// function WarehousesSection({
//     warehouses
// }: {
//     warehouses: IWarehouseResponse[]
// }) {
//     return (
//         <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
//             <Title text="Warehouses belong to this branch" icon="warehouse" color={Color.GREEN} />
//             <Table
//                 columns={[
//                     {id: 1, text: "Id", key: "id", linkRoot: "/admin-dashboard/warehouses/"},
//                     {id: 2, text: "Warehouses Name", key: "name"},
//                     {id: 3, text: "Address", key: "address"}, 
//                 ]}
//                 dataSet={warehouses}
//             />
//         </section>
//     )
// }