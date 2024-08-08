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
import { createReservation, getReservationDetail, updateReservation } from "@/api/reservation";
import { IPriceView, IReservationView } from "@/api/response";
import { getTicketByDateRegis } from "@/api/price";

export default function Page({
    params
}: {
    params: { id: string }
}) {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification();
    const searchParams = useSearchParams();
    const [frames, setFrames] = useState<IDropdownData[]>([
        { text: 'Khung 10h - 12h', value: '1' },
        { text: 'Khung 12h - 14h', value: '2' },
        { text: 'Khung 14h - 16h', value: '3' },
        { text: 'Khung 16h - 18h', value: '4' },
        { text: 'Khung 18h - 20h', value: '5' },
        { text: 'Khung 20h - 22h', value: '6' },
    ]);
    const [status, setStatus] = useState<IDropdownData[]>([
        { text: 'INIT', value: 'INIT' },
        { text: 'CANCELED', value: 'CANCELED' },
    ]);

    const [dateRegis, setDateRegis] = useState<string>();
    const [reservationId, setReservationId] = useState<number>(Number.parseInt(params.id));
    const [reservationTimeFrameId, setReservationTimeFrameId] = useState<number>(1);
    const [price, setPrice] = useState<IPriceView>();
    const [reservation, setReservation] = useState<IReservationView>();
    const [isDisable, setIsDisable] = useState<boolean>();

    console.log(reservationId)
    console.log(reservation)

    useEffect(() => {
        fetchReservationDetail();
    }, [reservationId])

    useEffect(() => {
        if (dateRegis != null)
            fetchPriceDate();
    }, [dateRegis])

    const fetchReservationDetail = async () => {
        try {
            showLoading();
            const { data } = await getReservationDetail(reservationId);
            setReservation(data);
            const reservationDate = new Date(data.date);
            const today = new Date();
            reservationDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            const isDisable = reservationDate < today;
            setIsDisable(isDisable)
            setReservationTimeFrameId(data.reservationTimeFrame.reservationTimeFrameId);
            setDateRegis(data.date);
            setInfo({
                ...info, adultsQuantity: data.adultsQuantity,
                childrenQuantity: data.childrenQuantity,
                note: data.note,
                status: data.status,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                notify(error.response?.data, "error");
            }
        }
        finally {
            hideLoading();
        }
    }

    async function fetchPriceDate() {
        try {
            showLoading();
            const { data } = await getTicketByDateRegis(dateRegis ?? "");
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

    const updateThisInvoice = async (event: React.FormEvent) => {
        event.preventDefault(); // Ngăn chặn việc load lại trang
        try {
            showLoading();
            const { data } = await updateReservation(
                reservationId,
                reservationTimeFrameId,
                dateRegis,
                info.adultsQuantity,
                info.childrenQuantity,
                info.note,
                info.status
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

    return (
        <>
            <Header />
            <section className=" mx-auto md:w-1/2 lg:w-1/3 pt-10 flex flex-col bg-gray-50 shadow-xl rounded-lg  h-[776px]  gap-8 p-8 ">
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
                    onSubmit={updateThisInvoice}
                >
                    <div className="flex justify-between items-center">
                        <p className="font-bold mb-2 text-2xl text-cyan-800 mr-2">Reservation Date: </p>
                        <input type="date" className="  px-4 py-2 rounded-l-lg bg-gray-200 text-gray-800 dark:text-white lg:hover:text-cyan-500 focus:outline-none  focus:bg-gray-200  focus:text-cyan-500"
                            onChange={(event: any) => {
                                const value = event.target.value;
                                setDateRegis(value);
                            }}
                            value={dateRegis}
                            min={getCurrentDate()}
                        />
                    </div>
                    <DropDown
                        label="Frame time"
                        dataset={frames}
                        handleChange={e => setReservationTimeFrameId(Number.parseInt(e.target.value))}
                        icon="clock"
                        value={reservationTimeFrameId}
                    />
                    <div className="rounded-lg font-bold bg-red-100 text-gray-800 pl-4">
                        Ticket price: Adult:{price?.adultPrice} -- Child:{price?.childPrice} VND{"/"}person
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
                    <p className="-mb-2">Reservation Date: </p>
                    <DropDown
                        label="status"
                        dataset={status}
                        handleChange={e => setInfo({ ...info, status: e.target.value })}
                        icon="circle-info"
                        value={status}
                    />
                    <button
                        className={`mt-4 w-full left-0 right-0 bottom-0 h-10 rounded-md bg-blue-400 text-white font-bold ${isDisable ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={isDisable}
                    >
                        Submit
                    </button>
                </form>
            </section>
        </>
    );

}