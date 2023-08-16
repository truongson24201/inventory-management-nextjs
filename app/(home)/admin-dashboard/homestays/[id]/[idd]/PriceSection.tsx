'use client';
import { getPricesOfHome, refreshPrices } from "@/api/homestay";
import { IHomesPricesResponse } from "@/api/price";
import DeleteButton from "@/components/DeleteButton";
import DropDown, { IDropdownData } from "@/components/DropDown";
import { FuncNav } from "@/components/NavGroup";
import Popup from "@/components/Popup";
import { Button } from "@/layouts/DashboardHeader";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PricesSection({
    homestayId,
}: {
    homestayId: number,
}) {
    const [prices , setPrices] = useState<IHomesPricesResponse[]>([]);
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();

    useEffect(() => {
        fetchPrices();
    }, []);

    // useEffect(() => {
    //     fetchDropDown();
    // }, []);

    async function fetchPrices() {
        try {
            showLoading();
            const {data: pricesRes} = await getPricesOfHome(homestayId);
            setPrices(pricesRes);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function refreshThisPrices(id:number) {
        try {
            showLoading();
            const {data} = await refreshPrices(id);
            setPrices(data);
            notify("Refresh successfully!", "success");
        }
        catch (error) {
            if (axios.isAxiosError(error)){
                notify(error.response?.data,"error");
            }
        }
        finally {
            hideLoading();
        }
    }

    return (
        <section className="flex flex-col gap-4 w-full h-full">
            <div className="flex justify-end">
                <Button 
                    text=""
                    icon="rotate"
                    bgColor={Color.WHITE}
                    actionHandler={async() => {
                        refreshThisPrices(homestayId);
                    }}
                    color={Color.BLACK}
                    size="xl"
                />  
            </div>
            <Table
                columns={[
                    // {id: 1, text: "Id", key: "pricelistId"},
                    {id: 2, text: "Effective Date", key: "effectiveDate"},
                    {id: 3, text: "[$]-Price", key: "price"},
                    {id: 4, text: "status", key: "status"},
                ]}
                dataSet={prices}
            />
        </section>
    )
}