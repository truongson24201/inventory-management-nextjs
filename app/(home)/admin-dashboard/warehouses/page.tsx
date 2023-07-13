'use client';
import { BranchResponse, getAllBranches } from "@/api/branch";
import { WarehouseResponse, getAllWarehouses } from "@/api/warehouse";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useActiveNav from "@/utils/hooks/useActiveNav"
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WarehouseData {
    id: number; 
    name: string; 
    address: string; 
    branchName: string | undefined;
}

export default function Page() {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [_, setActiveNav] = useActiveNav();
    const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
    const router = useRouter();

    useEffect(() => {
        setActiveNav("Warehouses");
        fetchWarehouses();
    }, []);

    async function fetchWarehouses() {
        try {
            showLoading();
            let warehouseData : WarehouseResponse[];
            let branchData: BranchResponse[];
            
            const warehouseResponse = await getAllWarehouses();
            const branchResponse = await getAllBranches();

            warehouseData = warehouseResponse.data;
            branchData = branchResponse.data;

            const newWarehouses = warehouseData.map((wh) => {
                const branch = branchData.find(br => br.id == wh.branchId);
                return {
                    id: wh.id,
                    name: wh.name,
                    address: wh.address,
                    branchName: branch?.name,
                }
            });

            setWarehouses(newWarehouses);
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
                    text="Add Warehouse"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {router.push("warehouses/add")}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        <SearchInput
                            placeholder="Type warehouse ID here..."
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "warehouses/"},
                            {id: 2, text: "Warehouse Name", key: "name"},
                            {id: 3, text: "Address", key: "address"}, 
                            {id: 4, text: "Branch Name", key: "branchName"}, 
                        ]}
                        dataSet={warehouses}
                    />
                </div>
            </Main>
        </section>
    )
}