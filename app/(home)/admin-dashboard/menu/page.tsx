'use client';
import { getAllNow1 } from "@/api/menu";
import { IPriceMenuItemView } from "@/api/response";
import ComboBox from "@/components/Combobox";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const [menus, setMenus] = useState<IPriceMenuItemView[]>([]);
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");


    useEffect(() => {
        fetAllMenu();
    },[])


    async function fetAllMenu() {
        try {
            showLoading();
            const { data } = await getAllNow1();
            setMenus(data);
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
                <Button 
                    text="Add Menu Item"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {router.push("menu/add")}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-10 h-10">
                        <SearchInput
                            placeholder="Type address ID here..."
                            value={searchValue}
                            handleChange={e => {}
                            //     {
                            //     const newSearchValue = e.target.value;
                            //     setSearchValue(newSearchValue);
                            //     const filterList = filterByFields(
                            //             toIndexSignature(menus), 
                            //             newSearchValue.trim(), 
                            //             ["bracnhId", "address"]
                            //         );
                            //     // setFilterBranch(filterList);
                            // }
                        }
                        />
                        {/* <ComboBox
                            label="Select role"
                            dataset={roles}
                            handleChange={e => {
                                setRoleId(Number.parseInt(e.target.value));
                            }}
                        />   */}
                    </section>
                    <Table
                        linkRoot = "menu/"
                        keyLink = "menuItem.menuItemId"
                        columns={[
                            // {id: 1, text: "Id", key: "branchId", linkRoot: "branches/"},
                            {id: 1, text: "Name", key: "menuItem.menuItemName"},
                            {id: 2, text: "Category", key: "menuItem.menuItemCategory.menuItemCategoryName"},
                            {id: 3, text: "Price", key: "price"}, 
                            {id: 4, text: "status", key: "menuItem.isActive"}, 
                        ]}
                        dataSet={menus}
                    />
                </div>
            </Main>
        </section>
    )
}