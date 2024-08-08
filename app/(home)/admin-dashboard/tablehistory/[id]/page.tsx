'use client';
import { getAllNow, getMenuDetail } from "@/api/menu";
import { IOrderView, IPriceMenuItemView, ITableHistoryView } from "@/api/response";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import DeleteButton from "@/components/DeleteButton";
import Icon from "@/components/Icon";
import InfoBar from "@/components/InfoBar";
import Popup from "@/components/Popup";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { callApiToCalculateTotal, deleteMenuInTableHistory, getHistoryDetail, getOrders, updateOrder } from "@/api/tablehistory";
import InfoSection from "./InfoSection";
import OrderSection from "./OrderSection";
import EditText from "@/components/EditText";
import DropDown, { IDropdownData } from "@/components/DropDown";
import axios from "axios";
import InfoBarLongText from "@/components/InfoBarLongText";

export default function Page({
    params
}: {
    params: { id: string }
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();

    const tableHistoryId = Number.parseInt(params.id);
    const [tableHistory, setTableHistory] = useState<ITableHistoryView>();
    const [isChange, setIsChange] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        fetchMenuItemDetail();
    }, []);

    useEffect(() => {
        fetchTotal();
    }, [isChange]);


    async function fetchMenuItemDetail() {
        try {
            showLoading();
            const { data } = await getHistoryDetail(tableHistoryId);
            setTableHistory(data);

        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function fetchTotal() {
        try {
            const { data } = await callApiToCalculateTotal(tableHistoryId);
            setTotal(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    async function removeThisHomestay() {
        try {
            showLoading();
            // await removeHomestay(menuItemId);
            router.push("./")
            notify("Remove homestay successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove homestay failed!", "error");
        }
        finally {
            hideLoading();
        }
    }



    const removeHomestayPopup =
        <Popup text="This homestay will be REMOVE or SHUTDOWN, you're sure?">
            <Button
                text="[Remove/Shutdown]"
                color={Color.WHITE}
                bgColor={Color.RED}
                actionHandler={() => {
                    popup.hide();
                    removeThisHomestay();
                }}
            />
            <Button
                text="Cancel"
                color={Color.BLACK}
                bgColor={Color.WHITE}
                actionHandler={() => { popup.hide() }}
            />
        </Popup>;


    // order section
    const [orders, setOrders] = useState<IOrderView[]>([]);
    const [menuItems, setMenuItems] = useState<IDropdownData[]>([]);


    const [info, setInfo] = useState({
        tableHistoryId: tableHistoryId,
        menuItemQuantity: 0,
        priceMenuItemId: 0,
    });

    useEffect(() => {
        fetchPrices();
    }, []);

    async function fetchPrices() {
        try {
            showLoading();
            const { data: res } = await getOrders(tableHistoryId);
            setOrders(res);
            const { data: res1 } = await getAllNow();
            setMenuItems(res1.map((item: IPriceMenuItemView) => ({
                text: item.menuItem.menuItemName,
                value: item.priceMenuItemId,
            })));
            setInfo({ ...info, priceMenuItemId: Number(res1[0].priceMenuItemId) });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }


    const requesCreactePrice = async () => {
        console.log(info, "info")
        if (info.priceMenuItemId != 0 && info.menuItemQuantity != 0) {
            try {
                const { data } = await updateOrder(info);
                orders.push(data);
                notify("data", "success");
                if(isChange)
                    setIsChange(false);
                else setIsChange(true);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    notify(error.response?.data, "error");
                }
            }
        }
    }

    const removeThisItemOutOf = async (tableHistoryId: number, priceMenuItemId: number) => {
        try {
            showLoading();
            await deleteMenuInTableHistory(tableHistoryId, priceMenuItemId);
            setOrders(orders.filter(t =>
                !(t.priceMenuItem.priceMenuItemId === priceMenuItemId && t.tableHistory.tableHistoryId === tableHistoryId)
            ));
            notify("REMOVE successfully!", "success");
            if(isChange)
                setIsChange(false);
            else setIsChange(true);
        }
        catch (error) {
            console.log(error);
            notify("Remove failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    // info section
    const inforBars: { label: string, key: string, icon: string }[] = [
        // {label: "Id", key: "menuId", icon: "hashtag"},
        { label: "Table", key: "buffetTable.buffetTableName", icon: "arrow-up-9-1" },
        { label: "Frame", key: "reservation.reservationTimeFrame.reservationTimeFrameName", icon: "signature" },
        { label: "Price Adult", key: "price.adultPrice", icon: "flag" },
        { label: "Price Child", key: "price.childPrice", icon: "flag" },
        { label: "Adult", key: "adultsQuantity", icon: "flag" },
        { label: "Child", key: "childrenQuantity", icon: "flag" },
        { label: "Start", key: "startDateTime", icon: "pen-to-square" },
        { label: "End", key: "endDateTime", icon: "pen-to-square" },
        { label: "Status", key: "tableHistoryStatus", icon: "person" },
    ];

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Edit"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE}
                        actionHandler={() => router.push(`${tableHistoryId}/edit`)}
                    />
                    <Button
                        text="Prepare Invoice"
                        color={Color.WHITE}
                        bgColor={Color.GREEN}
                        actionHandler={() => {
                            popup.show(removeHomestayPopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
                        <Title
                            text="Detailed Information"
                            icon="circle-info"
                            color={Color.BLUE}
                        />
                        <div className="relative w-full h-44">
                            <Image
                                className="object-contain"
                                src="/images/branch.jpg"
                                alt="Log in image"
                                fill
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            {inforBars.map(infoBar => {
                                const value = infoBar.key.split('.').reduce((obj, key) => obj?.[key], tableHistory);
                                const isLongText = infoBar.key === "menuItem.description";
                                return (
                                    <InfoBarLongText
                                        key={infoBar.key}
                                        label={infoBar.label}
                                        value={value?.toString() ?? ""}
                                        icon={infoBar.icon}
                                        isLongText={isLongText}
                                    />
                                );
                            })}
                            <InfoBarLongText
                                label={"Total"}
                                value={total.toLocaleString()}
                                icon={"sack-dollar"}
                            />
                        </div>
                    </section>
                    {/* <WarehousesSection warehouses={warehouses} /> */}
                    <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
                        <section className="flex flex-col gap-4 w-full h-full">
                            <div className="flex justify-between gap-2">
                                <DropDown
                                    label="Item"
                                    dataset={menuItems}
                                    handleChange={e => { setInfo({ ...info, priceMenuItemId: Number.parseInt(e.target.value) }); }}
                                    icon="address-card"
                                    value={info.priceMenuItemId}
                                />
                                <EditText
                                    icon={"circle-dollar-to-slot"}
                                    label={"Quantity"}
                                    value={info.menuItemQuantity}
                                    type={"number"}
                                    handleChange={(e) => {
                                        const value = e.target.value;
                                        setInfo({ ...info, menuItemQuantity: value === "" ? 0 : Number.parseInt(value) });
                                    }}
                                    errorText={""}
                                />
                                <Button
                                    text="Add"
                                    color={Color.WHITE}
                                    bgColor={Color.GREEN}
                                    actionHandler={requesCreactePrice}
                                />
                            </div>
                            <Table
                                columns={[
                                    // {id: 1, text: "Id", key: "pricelistId"},
                                    { id: 1, text: "Name", key: "priceMenuItem.menuItem.menuItemName" },
                                    { id: 2, text: "Quantity", key: "menuItemQuantity" },
                                ]}
                                dataSet={orders}
                                extra={{
                                    column: { id: 3, text: "Function" },
                                    node: <DeleteButton />,
                                    handleClick: (row: any) => {
                                        removeThisItemOutOf(row.tableHistory.tableHistoryId, row.priceMenuItem.priceMenuItemId);
                                    },
                                    key: "priceMenuItemId"
                                }}
                            />
                        </section>
                    </section>
                </div>
            </Main>
        </section>
    )
}

