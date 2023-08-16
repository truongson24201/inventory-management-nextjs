'use client';
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
import { IHomestayResponse, getAllHomestay } from "@/api/homestay";
import SearchInput from "@/components/SearchInput";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import Table from "@/layouts/Table";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [homestays, setHomestays] = useState<IHomestayResponse[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const branchId = Number.parseInt(params.id);
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();
    const [date,setDate] = useState("");
    const [filterHomestay, setFilterHomestay] = useState<IItem[]>([]);


    useEffect(() => {
        fetchHomestays();
    }, [date]);

    async function fetchHomestays() {
        try {
            showLoading();
            const {data: homestayRes} = await getAllHomestay(branchId,date);
            setHomestays(homestayRes);
            setSearchValue("");
            setFilterHomestay(homestayRes);
    
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
                    text="Add Homestay"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {router.push(`${branchId}/add`)}}
                    />
                </div>
            </Header>
            <Main>
            <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-10 h-10">
                        <SearchInput
                            placeholder="Type status here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(homestays), 
                                        newSearchValue.trim(), 
                                        ["status"]
                                    );
                                setFilterHomestay(filterList);
                            }}
                        />
                        <p className="mt-2 font-bold -mr-6">Homestay empty:</p>
                        <input type="date" className=" bg-gray-100 rounded-lg focus:text-cyan-500 lg:hover:text-cyan-500 outline-none" 
                            onChange={(event:any) => {
                                const value = event.target.value;
                                setDate(value);
                            }}
                            value={date}
                        />
                    </section>
                    <Table
                        linkRoot = {`${branchId}/`}
                        keyLink="homestayId"
                        columns={[
                            // {id: 1, text: "Id", key: "homestayId" , linkRoot: `${branchId}/`},
                            {id: 2, text: "Name", key: "name"},
                            {id: 5, text: "Num People", key: "numPeople"},
                            {id: 3, text: "status", key: "status"}, 
                        ]}
                        dataSet={filterHomestay}
                    />
                </div>
            </Main>
        </section>
    )
}
