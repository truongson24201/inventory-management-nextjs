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
import filterByFields, { toIndexSignature } from "@/utils/functions/filterByFields";
import Table from "@/layouts/Table";
import { IPricesResponse, createPrice, getPriceList } from "@/api/price";
import EditText from "@/components/EditText";
import axios, { AxiosError } from "axios";
import { getCurrentDateFormatted } from "@/utils/functions/dateFormet";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [priceList, setPriceList] = useState<IPricesResponse[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const branchId = Number.parseInt(params.id);
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();
    const [newPrice, setNewPrice] = useState({
        label: "Effective", 
        value: getCurrentDateFormatted(), 
        icon: "", 
        isRequired: true, 
        errorText: "" , 
        type: "date"
    });


    useEffect(() => {
        fetchPrices();
    }, []);

    async function fetchPrices() {
        try {
            showLoading();
            const {data: pricesRes} = await getPriceList(branchId);
            setPriceList(pricesRes);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const requesCreactePrice = async () => { 
        try {
            const {data} = await createPrice(branchId,newPrice.value);
            console.log(data);
            notify("data", "success");
            priceList.push(data);
        }
        catch (error) {
            if (axios.isAxiosError(error)){
                notify(error.response?.data, "error");
            }
        } 
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <EditText
                        icon={newPrice.icon}
                        label={newPrice.label}
                        value={newPrice.value}
                        type={newPrice.type}
                        min={getCurrentDateFormatted()}
                        handleChange={(e) => { 
                            setNewPrice({
                                ...newPrice,
                                value: e.target.value
                            }); 
                            console.log(e.target.value)
                        }}
                        errorText={newPrice.errorText} 
                    />
                    <Button 
                        text="Add Price"
                        color={Color.WHITE}
                        bgColor={Color.GREEN} 
                        actionHandler={requesCreactePrice}
                    />
                    <Title
                        text="To Price List"
                        icon="dollar-sign"
                        color={Color.GRAY}
                    />
                </div>
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
                                        toIndexSignature(priceList), 
                                        newSearchValue.trim(), 
                                        ["priceListId"]
                                    );
                                // setFilterBranch(filterList);
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
                        linkRoot = {`${branchId}/`}
                        keyLink="pricelistId"
                        columns={[
                            // {id: 1, text: "Id", key: "pricelistId" , linkRoot: `${branchId}/`},
                            {id: 2, text: "Effective Date", key: "effectiveDate"},
                            {id: 5, text: "Update On", key: "updateOn"},
                            {id: 3, text: "update By", key: "updateBy"}, 
                        ]}
                        dataSet={priceList}
                    />
                </div>
            </Main>
        </section>
    )
}
