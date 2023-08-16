'use client';
import { IAccountResponse, IRoleResponse, getAllAccounts  } from "@/api/account";
import { getAllRoles } from "@/api/role";
import ComboBox from "@/components/Combobox";
import DropDown, { IDropdownData } from "@/components/DropDown";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [accounts, setAccounts] = useState<IAccountResponse[]>([]);
    const [roles, setRoles] = useState<IDropdownData[]>([]);
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [roleId, setRoleId] = useState(1);
    const [filterAccounts, setFilterAccounts] = useState<IItem[]>([]);
    const notify = useNotification();  


    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [roleId])

    async function fetchRoles() {
        try {
            showLoading();
            const {data: roleRes} = await getAllRoles();
            setRoles(roleRes.map(role => ({
                text: role?.name ?? "", value: role?.id ?? 0
            })));
            // if (roleRes[0]) {
            //     setRoleId(roleRes[0].id);
            // }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function fetchAccounts() {
        try {
            showLoading();
            const {data} = await getAllAccounts(roleId);
            const accountRes = data.map((item: IAccountResponse) => ({
                ...item,
                status: item.status ? "Active" : "Inactive", 
            }));
            setAccounts(accountRes);
            setSearchValue("");
            setFilterAccounts(accountRes);
        } 
        catch (error) {
            if (axios.isAxiosError(error)){
                notify(error.response?.data, "error");
            }
        }
        finally {
            hideLoading();
        } 
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <Button 
                    text="Add Account"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {router.push("accounts/add")}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-10 h-10">
                        <SearchInput
                            placeholder="Type branch ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(accounts), 
                                        newSearchValue.trim(), 
                                        ["accountId", "username"]
                                    );
                                setFilterAccounts(filterList);
                            }}
                        />
                        <DropDown
                            label="Roles"
                            dataset={roles}
                            handleChange={e => setRoleId(Number.parseInt(e.target.value))}
                            icon="user"
                            value={roleId}
                        />
                    </section>
                    <Table
                        linkRoot = "accounts/"
                        keyLink = "accountId"
                        columns={[
                            // {id: 1, text: "Id", key: "accountId"},
                            {id: 2, text: "User name", key: "username"},
                            {id: 5, text: "Full name", key: "fullName"},
                            {id: 3, text: "Email", key: "email"}, 
                            {id: 4, text: "Phone", key: "phoneNumber"},
                            {id: 6, text: "status", key: "status"}, 
                        ]}
                        dataSet={filterAccounts}
                    />
                </div>
            </Main>
        </section>
    )
}