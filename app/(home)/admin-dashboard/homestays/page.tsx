'use client';
import { IBranchResponse, getAllBranches } from "@/api/branch";
import ComboBox from "@/components/Combobox";
import Title from "@/components/DashboardTitle";
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
    const [branches, setBranches] = useState<IBranchResponse[]>([]);

    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [filterBranch, setFilterBranch] = useState<IItem[]>([]);


    useEffect(() => {
        fetchBranches();
    },[])


    async function fetchBranches() {
        try {
            showLoading();
            const {data : branchRes} = await getAllBranches();
            setBranches(branchRes);
            // const {data : provinceRes} = await getProvinceDetails()
            // setAddress = 
            // branchRes.map((item:IBranchResponse) =>{
            //     ...item,
            //     province: `${item.province?.name} + ${item.district?.name} + ${item.ward?.name}`
            // })
            const filterAddress = branchRes.map((item: IBranchResponse) => {
                return {
                    ...item,
                    address: `${item.province?.name},  ${item.district?.name}, ${item.ward?.name}`,
                    statusString: item.status ? "Active" : "Inactive"
                }
            })

            setBranches(filterAddress)
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
                <Title
                    text="Branch List"
                    icon=""
                    color={Color.BLUE}
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
                                        toIndexSignature(branches), 
                                        newSearchValue.trim(), 
                                        ["bracnhId", "address"]
                                    );
                                setFilterBranch(filterList);
                            }}
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
                        linkRoot= "homestays/"
                        keyLink="branchId"
                        columns={[
                            // {id: 1, text: "Id", key: "branchId" , linkRoot: "homestays/"},
                            {id: 2, text: "Name", key: "name"},
                            {id: 5, text: "Address", key: "address"},
                            {id: 3, text: "status", key: "statusString"}, 
                        ]}
                        dataSet={branches}
                    />
                </div>
            </Main>
        </section>
    )
}