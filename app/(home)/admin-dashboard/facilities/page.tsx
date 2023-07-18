'use client';
import { ICategoryResponse, GetAllCategories } from "@/api/category";
import { IProductResponse, getAllProducts } from "@/api/product";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useEffect, useState } from "react";

interface IProductData {
    catName: string | undefined; 
    id: number; 
    name: string; 
    sku: string; 
    categoryId: number; 
    dimensions: string; 
    weight: string; 
    tempPrice: number; 
    imageUrl: string;
}

export default function Page() {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [products, setProducts] = useState<IProductData[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            showLoading();
            let catData: ICategoryResponse[];
            let prodData: IProductResponse[];

            const prodRes = await getAllProducts();
            const catRes = await GetAllCategories();
            
            if (prodRes.status === 200) {
                prodData = prodRes.data;

                if (catRes.status === 200) {
                    catData = catRes.data;
                }
                
                const newProducts = prodData.map((prod) => {
                    const cat = catData.find(cat => cat.id == prod.categoryId);

                    return ({
                        ...prod,
                        catName: cat?.name,
                    });
                });

                setProducts(newProducts);
            }
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
                    text="Add Product"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        {/* <SearchInput
                            placeholder="Type branch ID here..."
                        /> */}
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "products/"},
                            {id: 2, text: "Product Name", key: "name"},
                            {id: 3, text: "SKU", key: "sku"}, 
                            {id: 4, text: "Category Name", key: "catName"}, 
                            {id: 5, text: "Dimensions", key: "dimensions"}, 
                            {id: 6, text: "Weight", key: "weight"}, 
                            {id: 7, text: "tempPrice", key: "tempPrice"}, 
                        ]}
                        dataSet={products}
                    />
                </div>
            </Main>
        </section>
    )
}