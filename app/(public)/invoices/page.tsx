'use client';

import { IInvoices, getAllInvoicesClient } from "@/api/client";
import Header from "@/components/Header";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification(); 

    const [invoices, setInvoices] = useState<IInvoices[]>([]);
    // const invoiceId = Number.parseInt(params.id);

    useEffect(() => {
        fetchInvoicesClient();
    },[])

    const fetchInvoicesClient = async () => {
        try {
            showLoading();
            const {data} = await getAllInvoicesClient();
            setInvoices(data);
            // notify("")
        } catch (error) {
            if(axios.isAxiosError(error)){
                notify(error.response?.data,"error");
            }
        }
        finally{
            hideLoading();
        }
    }


    return(
        <>
            <Header />
            <div className="flex flex-col gap-4 w-[1200px] p-4 mx-auto border-2">
                <section className="">
                    <input 
                        className="w-72 h-9 px-2 py-1 rounded-md border-2"
                        placeholder="Type something here..."
                    />
                </section>
                <section className="grid grid-cols-3 gap-4">
                    {invoices.map(invoice => 
                        <Invoice invoice={invoice} />    
                    )}
                </section>
            </div>
        </>
    )

}

function Invoice({
    invoice
}: {
    invoice: IInvoices
}) {

    const router = useRouter();

    return (
        <div className="flex flex-col gap-3 py-2 px-3 bg-gray-100 rounded-md shadow-lg">
            <div className="mt-2 flex items-center justify-center rounded-sm bg-slate-200 cursor-pointer hover:bg-slate-300 "
            onClick={() => router.push(`invoices/${invoice.invoiceId}`)}
            >
                <h3 className="text-lg font-bold text-cyan-800 ">
                    {invoice.name}
                </h3>
            </div>
            <p className="italic">
                {invoice.address}
            </p>
            <div>
                <p><span className="font-semibold w-24 inline-block">In--{">"}Out: </span>{invoice.checkIn} --{">"}{invoice.checkOut}</p>
                <p><span className="font-semibold w-24 inline-block">Update On: </span>{invoice.updateOn}</p>
            </div>
            <p className="font-bold text-red-500">
                <span className="">Total: </span>
                ${invoice.total}
            </p>
            <p>
                <span className="font-semibold">Name: </span>
                {invoice.fullName}
            </p>
            <p>
                <span className="font-semibold">Phone: </span>
                {invoice.phoneNumber}
            </p>
            <div className="pb-2">
                <p>
                    <span className="font-semibold">Status: </span>
                    <span className={
                        invoice.status == "UNPAID"
                        ? ("bg-gray-300 p-1 rounded-sm")
                        : invoice.status == "PAID"
                        ? ("bg-green-200 p-1 rounded-sm")
                        : invoice.status == "PENDING"
                        ? ("bg-yellow-200 p-1 rounded-sm")
                        : invoice.status == "CANCEL"
                        ? ("bg-red-300 p-1 rounded-sm")
                        : ("bg-green-200 p-1 rounded-sm")
                        }> {invoice.status}</span>
                </p>
            </div>
        </div>
    )
}