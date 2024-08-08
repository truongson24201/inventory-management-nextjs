'use client';
import { getPricesOfHome, refreshPrices } from "@/api/homestay";
import { createPriceMenuItem, deletePriceMenuItem, getByMenuItemById, updatePriceMenuItem } from "@/api/price";
import { IPriceMenuItemView } from "@/api/response";
import DeleteButton from "@/components/DeleteButton";
import DropDown, { IDropdownData } from "@/components/DropDown";
import EditText from "@/components/EditText";
import Icon from "@/components/Icon";
import { FuncNav } from "@/components/NavGroup";
import Popup from "@/components/Popup";
import { Button } from "@/layouts/DashboardHeader";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import { getCurrentDateFormatted } from "@/utils/functions/dateFormet";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PricesSection({
    menuItemId,
}: {
    menuItemId: number,
}) {
    const [prices, setPrices] = useState<IPriceMenuItemView[]>([]);
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();
    const [info, setInfo] = useState({
        priceMenuItemId: 0,
        price: 0,
        applicationDate: "",
        menuItemId: 0,
    });

    useEffect(() => {
        fetchPrices();
    }, []);

    // useEffect(() => {
    //     fetchDropDown();
    // }, []);

    async function fetchPrices() {
        try {
            showLoading();
            const { data } = await getByMenuItemById(menuItemId);
            setPrices(data);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // Định dạng tháng và ngày thành chuỗi 2 chữ số
        const motha = month < 10 ? '0' + month : month;
        const daya = day < 10 ? '0' + day : day;
        return `${year}-${motha}-${daya}`;
    };

    const requesCreactePrice = async () => {
        if (info.price != 0 && info.applicationDate != "") {
            try {
                if (info.priceMenuItemId == 0) {
                    const { data } = await createPriceMenuItem(null, info.price, info.applicationDate, menuItemId);
                    prices.push(data);
                } else {
                    const { data } = await updatePriceMenuItem(info.priceMenuItemId, info.price, info.applicationDate, menuItemId);
                    setPrices((prevPrices) =>
                        prevPrices.map((item) =>
                            item.priceMenuItemId === data.priceMenuItemId
                                ? { ...item, ...data } // Cập nhật giá trị cho phần tử
                                : item
                        )
                    );
                }
                notify("data", "success");
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    notify(error.response?.data, "error");
                }
            }
        }

    }

    const removeThisPriceOutOf = async (id: number) => {
        try {
            showLoading();

            const { data: old } = await deletePriceMenuItem(id);
            // router.push("./")
            setPrices(prices.filter(t => t.priceMenuItemId != id));
            // const newDropdown = [
            //     ...facilitiesDataset,
            //     {
            //         text: old.name ?? "",
            //         value: old.touristId + "" ,
            //     }
            // ];
            // setFacilitiesDateset(newDropdown); 
            // newDropdown?.[0] && setFaclitityId(Number.parseInt(newDropdown[0].value + ""));
            notify("REMOVE successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove tourist out of this branch failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    return (
        <section className="flex flex-col gap-4 w-full h-full">
            <div className="flex justify-between">
                <EditText
                    icon={""}
                    label={"ApplicationDate"}
                    value={info.applicationDate}
                    type={"date"}
                    min={getCurrentDateFormatted()}
                    handleChange={(e) => { setInfo({ ...info, applicationDate: e.target.value }); }}
                    errorText={""}
                />
                <EditText
                    icon={"circle-dollar-to-slot"}
                    label={"Price"}
                    value={info.price}
                    type={"number"}
                    handleChange={(e) => {
                        const value = e.target.value;
                        setInfo({ ...info, price: value === "" ? 0 : Number.parseInt(value) });
                    }}
                    errorText={""}
                />
                <button
                    className=""
                    onClick={() =>{setInfo({
                        priceMenuItemId:0,
                        price: 0,
                        applicationDate:"",
                        menuItemId:0
                    })}}
                >
                    <Icon name="rotate-right" size="xl" />
                </button>
                <Button
                    text="Add Price"
                    color={Color.WHITE}
                    bgColor={Color.GREEN}
                    actionHandler={requesCreactePrice}
                />
            </div>
            <Table
                columns={[
                    // {id: 1, text: "Id", key: "pricelistId"},
                    { id: 1, text: "[VND]-Price", key: "price" },
                    { id: 2, text: "Application Date", key: "applicationDate" },
                ]}
                dataSet={prices}
                onRowClick={(row) => {
                    setInfo(row);
                }}
                extra={{
                    column: { id: 3, text: "Function" },
                    node: <DeleteButton />,
                    handleClick: (id: number) => {
                        removeThisPriceOutOf(id);
                    },
                    key: "priceMenuItemId"
                }}
            />
        </section>
    )
}