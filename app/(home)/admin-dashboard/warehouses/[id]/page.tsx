'use client';
import { getBranchById } from "@/api/branch";
import { getWarehouseById } from "@/api/warehouse";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useActiveNav from "@/utils/hooks/useActiveNav";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import InfoBar from "@/components/InfoBar";
import Table from "@/layouts/Table";
import { getWhsProductsByWarehouse, warehouseProductResponse } from "@/api/warehouseProduct";
import { ProductResponse, getAllProducts } from "@/api/product";

interface Warehouse {
    id: number,
    name: string,
    address: string,
    branchName: string,
}

interface Product {
    id: number,
    name: string,
    quantity: number,
}

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [_, setActiveNav] = useActiveNav();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const warehouseId = Number.parseInt(params.id);
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouse, setWarehouse] = useState<Warehouse>({
        id: 1,
        name: "",
        address: "",
        branchName: ""
    });

    useEffect(() => {
        setActiveNav("Warehouses");
        fetchWarehouse();
        fetchWarehouseProducts();
    }, []);

    async function fetchWarehouse() {
        try {
            showLoading();
            const {data: warehouseData} = await getWarehouseById(warehouseId);
            const {data: branchData} = await getBranchById(warehouseData.branchId);

            setWarehouse({
                id: warehouseData.id,
                name: warehouseData.name,
                address: warehouseData.address,
                branchName: branchData.name
            })
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function fetchWarehouseProducts() {
        try {
            showLoading();
            const {data: whProductData} = await getWhsProductsByWarehouse(warehouseId);
            const {data: productData} = await getAllProducts();

            const newProds: Product[] = [];

            whProductData.forEach((whsProd: warehouseProductResponse) => {
                const {name} = productData.find((prod: ProductResponse) => whsProd.productId === prod.id);
                newProds.push({
                    id: whsProd.productId,
                    name,
                    quantity: whsProd.quantity
                });
            });

            setProducts(newProds);
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
                        text="Edit"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE} 
                        actionHandler={() => router.push(`${warehouseId}/edit`)}
                    />
                    {/* <Button
                        text="Delete"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(deleteBranchPopup);
                        }}
                    /> */}
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection warehouse={warehouse} />
                    <ProductSection products={products} />
                </div>
            </Main>
        </section>
    )
}



function InfoSection({
    warehouse
}: {
    warehouse: Warehouse
}) {
    const inforBars: {label: string, key: "id" | "name" | "address" | "branchName", icon: string}[] = [
        {label: "Id", key: "id", icon: "hashtag"},
        {label: "Name", key: "name", icon: "signature"},
        {label: "Address", key: "address", icon: "map-location-dot"},
        {label: "Branch", key: "branchName", icon: "building"},
    ];

    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLUE}
            />
            <div className="relative w-full h-52">
                <Image
                    className="object-contain"
                    src="/images/warehouse.webp"
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        key={infoBar.label}
                        label={infoBar.label}
                        value={warehouse?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}

function ProductSection({
    products
}: {
    products: {
        id: number,
        name: string,
        quantity: number,
    }[]
}) {
    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Warehouses belong to this branch" icon="warehouse" color={Color.GREEN} />
            <Table
                columns={[
                    {id: 1, text: "Id", key: "id", linkRoot: "/admin-dashboard/products/"},
                    {id: 2, text: "Product Name", key: "name"},
                    {id: 3, text: "Quantity", key: "quantity"}, 
                ]}
                dataSet={products}
            />
        </section>
    )
}