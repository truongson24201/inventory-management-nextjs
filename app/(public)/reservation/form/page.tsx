'use client';

import Image from "next/image";
import { Button, Input } from "@/app/(log-in)/admin-login/Form";
import Header from "@/components/Header";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import DropDown, { IDropdownData } from "@/components/DropDown";
import { createReservation } from "@/api/reservation";
import { IPriceView } from "@/api/response";
import { getTicketByDateRegis } from "@/api/price";

export default function Page() {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification();
    const searchParams = useSearchParams();
    const dateRegis1 = searchParams.get('checkIn')?.toString() ?? "";
    const [frames, setFrames] = useState<IDropdownData[]>([
        { text: 'Khung 10h - 12h', value: '1' },
        { text: 'Khung 12h - 14h', value: '2' },
        { text: 'Khung 14h - 16h', value: '3' },
        { text: 'Khung 16h - 18h', value: '4' },
        { text: 'Khung 18h - 20h', value: '5' },
        { text: 'Khung 20h - 22h', value: '6' },
    ]);
    const [dateRegis, setDateRegis] = useState<string>(dateRegis1);
    const [reservationId, setReservationId] = useState<number | null>(null);
    const [reservationTimeFrameId, setReservationTimeFrameId] = useState<number>(1);

    const [price, setPrice] = useState<IPriceView>();

    useEffect(() => {
        fetchPriceDate();
    }, [])

    async function fetchPriceDate() {
        try {
            showLoading();
            const { data } = await getTicketByDateRegis(dateRegis);
            setPrice(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                notify(error.response?.data, "error");
            }
        }
        finally {
            hideLoading();
        }
    }

    const [info, setInfo] = useState({
        adultsQuantity: 0,
        childrenQuantity: 0,
        note: "",
        status: "",
    });

    const createThisInvoice = async (event: React.FormEvent) => {
        event.preventDefault(); // Ngăn chặn việc load lại trang
        try {
            showLoading();
            const { data } = await createReservation(
                null,
                reservationTimeFrameId,
                dateRegis,
                info.adultsQuantity,
                info.childrenQuantity,
                info.note,
                info.status,
            );
            notify("Booking this time Successfully!", "success");
            router.push(`./`);
            console.log(data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                notify(error.response?.data, "error");
            }
        }
        finally {
            hideLoading();
        }
    }

    console.log(reservationTimeFrameId)

    return (
        <>
            <Header />
            <section className=" mx-auto md:w-1/2 lg:w-1/3 pt-10 flex flex-col bg-gray-50 shadow-xl rounded-lg  h-[676px]  gap-8 p-8 ">
                <section className="mb-4">
                    <div className="mx-auto relative w-full h-28">
                        <Image
                            className="object-contain"
                            src="/images/751586.png"
                            fill
                            alt="welcome illustration"
                        />
                    </div>
                    <h2 className="text-xl font-extrabold text-center">Enter information</h2>
                </section>

                <form
                    className="relative w-[400px] h-full flex flex-col gap-3 mx-auto "
                    onSubmit={createThisInvoice}
                >
                    <DropDown
                        label="Frame time"
                        dataset={frames}
                        handleChange={e => setReservationTimeFrameId(Number.parseInt(e.target.value))}
                        icon="clock"
                        value={reservationTimeFrameId}
                    />
                    <h2 className="font-bold mb-2 text-2xl text-cyan-800">Registration Date: {dateRegis}</h2>
                    <div className="rounded-lg font-bold bg-red-100 text-gray-800 pl-4">
                        Ticket price: Adult:{price?.adultPrice.toLocaleString()} -- Child:{price?.childPrice.toLocaleString()} VND{"/"}person
                    </div>
                    <Input
                        type="number"
                        icon="file-signature"
                        label="Adults quantity"
                        placeholder="Your adults quantity"
                        value={info.adultsQuantity.toString()}
                        handleChangeInput={e => {
                            const value = e.target.value;
                            setInfo({ ...info, adultsQuantity: value === "" ? 0 : Number.parseInt(value) });
                        }}
                    />
                    <Input
                        type="number"
                        icon="file-signature"
                        label="Children quantity"
                        placeholder="Your children quantity"
                        value={info.childrenQuantity.toString()}
                        handleChangeInput={e => {
                            const value = e.target.value;
                            setInfo({ ...info, childrenQuantity: value === "" ? 0 : Number.parseInt(value) });
                        }}
                    />
                    <Input
                        icon="file-signature"
                        label="Note"
                        placeholder="Your note"
                        value={info.note}
                        handleChangeInput={e => {
                            setInfo({ ...info, note: e.target.value });
                        }}
                    />
                    <button className="mt-4 w-full left-0 right-0 bottom-0 h-10 rounded-md bg-blue-400 text-white font-bold"
                    >
                        Submit
                    </button>
                </form>
            </section>
        </>
    );

}