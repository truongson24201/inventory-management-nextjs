'use client';
import { getAllNow1 } from "@/api/menu";
import { getReservationCheckIn } from "@/api/reservation";
import { IReservationView } from "@/api/response";
import ComboBox from "@/components/Combobox";
import EditText from "@/components/EditText";
import Icon from "@/components/Icon";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import { getCurrentDateFormatted } from "@/utils/functions/dateFormet";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import { FormatCurrentDate } from "@/utils/functions/FormatCurrentDate";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const [reservations, setReservations] = useState<IReservationView[]>([]);
    const router = useRouter();
    const [phone, setPhone] = useState<string>("");
    const [date, setDate] = useState<string>(FormatCurrentDate(new Date));

    useEffect(() => {
        fetAllReservation();
    }, [])


    async function fetAllReservation() {
        try {
            showLoading();
            const { data } = await getReservationCheckIn(phone,date);
            setReservations(data);
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
                    text=""
                    color={Color.WHITE}
                    bgColor={Color.GREEN}
                    actionHandler={() => {}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-10 h-10">
                        <EditText
                            icon={"signature"}
                            label={"Phone"}
                            value={phone}
                            type={"text"}
                            handleChange={(e) => { setPhone(e.target.value) }}
                            errorText={""}
                        />
                        <EditText
                            icon={"signature"}
                            label={"Date"}
                            value={date}
                            type={"date"}
                            handleChange={(e) => { setDate(e.target.value) }}
                            errorText={""}
                        />
                    <button
                        className=""
                        onClick={fetAllReservation}
                    >
                        <Icon name="magnifying-glass" size="xl" />
                    </button>
                    </section>
                    <Table
                        linkRoot="reservation/"
                        keyLink="reservationId" 
                        // profix="edit"
                        columns={[
                            // {id: 1, text: "Id", key: "branchId", linkRoot: "branches/"},
                            { id: 1, text: "Name", key: "customer.fullName" },
                            { id: 2, text: "Phone", key: "customer.phone" },
                            { id: 3, text: "Frame", key: "reservationTimeFrame.reservationTimeFrameName" },
                            { id: 4, text: "Table", key: "tableName" },
                            { id: 4, text: "Adult", key: "adultsQuantity" },
                            { id: 4, text: "Child", key: "childrenQuantity" },
                        ]}
                        dataSet={reservations}
                    />
                </div>
            </Main>
        </section>
    )
}