'use client';

import { getBillsByDate } from "@/api/bill";
import { getReservation } from "@/api/reservation";
import { IReservationView } from "@/api/response";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification();

    const [reservations, setReservations] = useState<IReservationView[]>([]);
    const [date, setDate] = useState<string | null>(null);
    // const invoiceId = Number.parseInt(params.id);
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

    useEffect(() => {
        fetBillsByDate();
    }, [])

    const fetBillsByDate = async () => {
        try {
            showLoading();
            const { data } = await getBillsByDate(date);
            setReservations(data);
            // notify("")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                notify(error.response?.data, "error");
            }
        }
        finally {
            hideLoading();
        }
    }


    return (
        <>
            <Header />
            <div className="flex flex-col gap-4 w-[1200px] p-4 mx-auto border-2">
                <section className="">
                    <input type="date" className="px-4 py-2 rounded-l-lg bg-gray-200 text-gray-800 dark:text-white lg:hover:text-cyan-500 focus:outline-none  focus:bg-gray-200  focus:text-cyan-500 mr-2  mb-2 md:mb-0 md:w-1/6"
                        onChange={(event: any) => {
                            const value = event.target.value;
                            setDate(value);
                        }}
                        value={date ?? ""}
                        min={getCurrentDate()}
                    />
                    <button
                        className=""
                        onClick={fetchreservationsClient}
                    >
                        <Icon name="magnifying-glass" size="xl" />
                    </button>
                </section>
                <section className="grid grid-cols-3 gap-4">
                    {reservations.map(reservations =>
                        <IReservation reservation={reservations} />
                    )}
                </section>
            </div>
        </>
    )

}

function IReservation({
    reservation
}: {
    reservation: IReservationView
}) {

    const router = useRouter();

    return (
        <div className="flex flex-col gap-3 py-2 px-3 bg-gray-100 rounded-md shadow-lg">
            <div className="mt-2 flex items-center justify-center rounded-sm bg-slate-200 cursor-pointer hover:bg-slate-300 "
                onClick={() => router.push(`reservation/${reservation.reservationId}`)}
            >
                <h3 className="text-lg font-bold text-cyan-800 ">
                    {reservation.tableName}
                </h3>
            </div>
            <p className="font-semibold">
                Date of create: {reservation.createdDatetime}
            </p>
            <p className="font-semibold">
                Booking date: {reservation.date}
            </p>
            <p><span className="font-semibold w-24 inline-block">Frame: </span>{reservation.reservationTimeFrame.reservationTimeFrameName}</p>
            <p><span className="font-semibold w-24 inline-block">Quantity: </span>Adult:{reservation.adultsQuantity} -- Child:{reservation.childrenQuantity}</p>
            <p className="font-bold text-red-500">
                <span className="">Adult Price: </span>
                ${reservation.price.adultPrice}
            </p>
            <p className="font-bold text-red-500">
                <span className="">Child Price: </span>
                ${reservation.price.childPrice}
            </p>
            <p>
                <span className="font-semibold">Name: </span>
                {reservation.customer.fullName}
            </p>
            <p>
                <span className="font-semibold">Phone: </span>
                {reservation.customer.phone}
            </p>
            <div className="pb-2">
                <p>
                    <span className="font-semibold">Status: </span>
                    <span className={
                        reservation.status == "CANCELED"
                            ? ("bg-red-300 p-1 rounded-sm")
                            : ("bg-green-200 p-1 rounded-sm")
                    }> {reservation.status}</span>
                </p>
            </div>
        </div>
    )
}