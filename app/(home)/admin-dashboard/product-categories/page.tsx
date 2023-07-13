'use client';
import { GetAllCategories } from "@/api/category";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useActiveNav from "@/utils/hooks/useActiveNav"
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useEffect, useState } from "react";

export default function Page() {
    const [_, setActiveNav] = useActiveNav();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setActiveNav("Product Categories");
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            showLoading();
            const res = await GetAllCategories();
            console.log(res);
            if (res.status === 200) {
                setCategories(res.data);
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
                    text="Add Category"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        <SearchInput
                            placeholder="Type category ID here..."
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "users/"},
                            {id: 2, text: "Category Name", key: "name"},
                            {id: 3, text: "Description", key: "description"}, 
                            {id: 4, text: "Image", key: "imageUrl"}, 
                        ]}
                        dataSet={categories}
                    />
                </div>
            </Main>
        </section>
    )
}