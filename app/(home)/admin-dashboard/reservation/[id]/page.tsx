'use client'
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import EditText from "@/components/EditText";
import Header, { Button } from "@/layouts/DashboardHeader"
import Main from "@/layouts/DashboardMain"
import { Color } from "@/utils/constants/colors"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useNotification from "@/utils/hooks/useNotification";
import DropDown, { IDropdownData } from "@/components/DropDown";
import { createMenuItem, CUMenuItemReq, getAllCategory } from "@/api/menu";
import { CUTableHistoryReq, getHistoryDetail, updateTableHistory } from "@/api/tablehistory";
import { ITableHistoryView } from "@/api/response";
import EditTextLong from "@/components/EditTextLong";
import axios from "axios";


export default function Page({
    params
}: {
    params: {id: string}
}) {

    const router = useRouter();
    const notify = useNotification();
    const tableHistoryId = Number.parseInt(params.id);

    const [menuItemGroup, setMenuItemGroup] = useState<IDropdownData[]>([
        { text: 'RESERVED', value: 'RESERVED' },
        { text: 'SERVING', value: 'SERVING' },
        { text: 'CANCELED', value: 'CANCELED' },
        { text: 'FINISHED', value: 'FINISHED' },
    ]);
    const [tableHistory,setTableHistory] = useState<ITableHistoryView>();


    const [info, setInfo] = useState<CUTableHistoryReq>({
        tableHistoryId: 0,
        adultsQuantity: 0,
        childrenQuantity: 0,
        status: "SERVING",
    });


    useEffect(() => {
        fetchHistoryDetail();
    }, []);

    const fetchHistoryDetail = async () => {
        try {
            const {data:res} = await getHistoryDetail(tableHistoryId);
            setTableHistory(res);
            setInfo({ ...info, adultsQuantity:res.reservation.adultsQuantity,
                childrenQuantity: res.reservation.childrenQuantity,
                tableHistoryId: res.tableHistoryId
            });
            console.log(info)
        }
        catch (error) {
            console.log(error);
        }
    }

    const requestCheckInReservation = async () => {
        try {
            await updateTableHistory(info);
            router.push(`../tablehistory/${tableHistoryId}`);
            notify("Check In is uccessfully", "success");
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
                    <Button
                        text="Save"
                        color={Color.WHITE}
                        bgColor={Color.GREEN}
                        actionHandler={requestCheckInReservation}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-[480px] h-full flex flex-col gap-8 p-5 mx-auto border-2 rounded-md shadow-md">
                    <Title
                        text="Check In"
                        icon="plus"
                        color={Color.GREEN}
                    />
                    <EditText
                        icon={"signature"}
                        label={"Name"}
                        value={tableHistory?.reservation.customer.fullName}
                        type={"text"}
                        handleChange={()=>{}}
                        errorText={""}
                        disabled= {true}
                    />
                    <EditText
                        icon={"signature"}
                        label={"Table"}
                        value={tableHistory?.buffetTable.buffetTableName}
                        type={"text"}
                        handleChange={() => { }}
                        errorText={""}
                        disabled= {true}
                    />
                    <EditTextLong
                        icon={"arrow-up-9-1"}
                        label={"Note"}
                        value={tableHistory?.reservation.note}
                        type={"text"}
                        handleChange={() => { }}
                        errorText={""}
                        disabled= {true}
                        isLongText = {true}
                    />
                    <EditText
                        icon={"signature"}
                        label={"Adult"}
                        value={info.adultsQuantity}
                        type={"number"}
                        handleChange={(e) => { setInfo({ ...info, adultsQuantity: Number.parseInt(e.target.value) }); }}
                        errorText={""}
                    />
                    <EditText
                        icon={"signature"}
                        label={"Child"}
                        value={info.childrenQuantity}
                        type={"number"}
                        handleChange={(e) => { setInfo({ ...info, childrenQuantity: Number.parseInt(e.target.value) }); }}
                        errorText={""}
                    />
                    
                    <DropDown
                        label="Status"
                        dataset={menuItemGroup}
                        handleChange={e => { setInfo({ ...info, status: e.target.value }); }}
                        icon="address-card"
                        value={info.status}
                        disabled={true}
                    />
                </div>
            </Main>
        </section>
    )
}