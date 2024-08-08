'use client';
import { getPricesOfHome, refreshPrices } from "@/api/homestay";
import { getAllNow } from "@/api/menu";
import { IOrderView, IPriceMenuItemView } from "@/api/response";
import { deleteMenuInTableHistory, getOrders, updateOrder } from "@/api/tablehistory";
import DeleteButton from "@/components/DeleteButton";
import DropDown, { IDropdownData } from "@/components/DropDown";
import EditText from "@/components/EditText";
import { Button } from "@/layouts/DashboardHeader";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderSection({
    tableHistoryId,
}: {
    tableHistoryId: number,
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();
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

    // useEffect(() => {
    //     fetchDropDown();
    // }, []);

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
            setInfo({...info, priceMenuItemId: Number(res1[0].priceMenuItemId)});
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }


    const requesCreactePrice = async () => {
        console.log(info,"info")
        if (info.priceMenuItemId != 0 && info.menuItemQuantity != 0) {
            try {
                const { data } = await updateOrder(info);
                orders.push(data);
                notify("data", "success");
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
        }
        catch (error) {
            console.log(error);
            notify("Remove failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    return (
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
                    handleClick: (row:any)=> {
                        removeThisItemOutOf(row.tableHistory.tableHistoryId,row.priceMenuItem.priceMenuItemId);
                    },
                    key: "priceMenuItemId"
                }}
            />
        </section>
    )
}