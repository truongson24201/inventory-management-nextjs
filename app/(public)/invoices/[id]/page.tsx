'use client';

import { IInvoices, cancelInvoice, createPaymentPaypal, getAllInvoicesClient, getInvoiceClientDetails, updateInfoInvoice } from "@/api/client";
import Title from "@/components/DashboardTitle";
import EditText from "@/components/EditText";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import InfoBar from "@/components/InfoBar";
import Popup from "@/components/Popup";
import { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page({
    params
}: {
    params: {id: string}
}) {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification(); 
    const notifyPopup = useNotification();
    const popup = usePopup();
    const invoiceId = Number.parseInt(params.id);

    const [invoice, setInvoice] = useState<IInvoices>({
        invoiceId:0,
        homestayId:0,
        name:"",
        address:"",
        checkIn:"",
        checkOut:"",
        updateOn:"",
        numPeople:1,
        total:0,
        fullName:"",
        email:"",
        phoneNumber:"",
        status:"",
    });

    const [fields, setFields] = useState([
        {label: "Full Name", value: "", icon: "address-card", isRequired: true, errorText: ""},
        {label: "Email", value: "", icon: "at", isRequired: true, errorText: ""},
        {label: "Phone number", value: "", icon: "phone", isRequired: true, errorText: ""},
    ]);

    

    const [editInvoice, setEditInvoice] = useState(false);
    const [payment, setPayment] = useState(false);


    useEffect(() => {
        fetchInvoicesClient();
    },[])

    const fetchInvoicesClient = async () => {
        try {
            showLoading();
            const {data} = await getInvoiceClientDetails(invoiceId);
            setInvoice(data);
            setFields([
                {...fields[0], value: invoice?.fullName ?? ""},
                {...fields[1], value: invoice?.email ?? ""},
                {...fields[2], value: invoice?.phoneNumber ?? ""},
            ])
        } catch (error) {
            if(axios.isAxiosError(error)){
                notify(error.response?.data,"error");
            }
        }
        finally{
            hideLoading();
        }
    }


    const onChangeEditInvoice = async () => {
        let newEditInvoice = editInvoice;
        if (invoice.status == "PAID" || invoice.status == "UNPAID" || invoice.status == "PENDING"){
            newEditInvoice = true;
            setEditInvoice(newEditInvoice);
            setFields([
                {...fields[0], value: invoice?.fullName ?? ""},
                {...fields[1], value: invoice?.email ?? ""},
                {...fields[2], value: invoice?.phoneNumber ?? ""},
            ])
        }else {
            newEditInvoice = false;
            setEditInvoice(newEditInvoice);
            notify("Cannot be edited because the payment status has been paid or canceled","error");
        }
    }

    const onChangePayment = async () => {
        let newPayment = payment;
        if (invoice.status == "UNPAID"){
            newPayment = true;
            setPayment(newPayment);
            requestPayment();
        }else {
            newPayment = false;
            setEditInvoice(newPayment);
            notify("No processing","error");
        }
    }

    const cancelInvoicePopup = 
        <Popup text="This Invoice will be CANCEL, you're sure?">
            <Button
                text="YES"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    cancelThisInvoice();
                }}
            />
            <Button
                text="NO"
                color={Color.BLACK}
                bgColor={Color.WHITE} 
                actionHandler={() => {popup.hide()}}
            />
        </Popup>;
        
    const cancelThisInvoice = async () => {
        try {
            showLoading();
            const {data} = await cancelInvoice(invoiceId);
            setInvoice(data);
            notify("Cancel invoice successfully!","success");
        } catch (error) {
            if(axios.isAxiosError(error)){
                notify(error.response?.data,"error");
            }
        }
        finally{
            hideLoading();
        }
    }

    const requestUpdateInvoice = async () => {
        try {
            showLoading();
            const {data} = await updateInfoInvoice(invoice.invoiceId,fields[0].value,fields[1].value,fields[2].value);
            setInvoice(data);
            notify("Update invoice successfully!","success");
        } catch (error) {
            if(axios.isAxiosError(error)){
                notify(error.response?.data,"error");
            }
        }
        finally {
            hideLoading();
        }
    }

    const requestPayment = async () => {
        try {
            showLoading();
            const {data} = await createPaymentPaypal(invoice.total,invoice.invoiceId);
            router.push(data);
            // notify("Update invoice successfully!","success");
        } catch (error) {
            if(axios.isAxiosError(error)){
                notify(error.response?.data,"error");
            }
        }
        finally {
            hideLoading();
        }
    }
    

    return(
        <>
            <Header />
            <Main>
                <div className="w-full h-full flex gap-3">
                    <section className="ml-4 w-2/12 p-3 h-full pt-10 flex flex-col border-2 rounded-l-sm bg-gray-50 shadow-xl gap-6">
                    <Button
                        text="EDIT"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE} 
                        actionHandler={onChangeEditInvoice}
                    />
                    <Button
                        text="PAYMENT"
                        color={Color.WHITE}
                        bgColor={Color.GREEN} 
                        actionHandler={onChangePayment}
                    />
                    <Button
                        text="CANCEL"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() =>{
                            popup.show(cancelInvoicePopup);
                        }}
                    />
                    </section>
                    <InvoiceDetails 
                        invoice={invoice} invoiceId={invoiceId}
                    />
                    {
                        editInvoice === true &&
                        <section className="ml-30 w-2/5 p-3 h-full pt-10 flex flex-col border-2 rounded-l-sm bg-gray-50 shadow-xl gap-6">
                            <Title text="Edit Invoice" icon="file-invoice" color={Color.GREEN} />
                            <div className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                                {fields.map((field, idx) => 
                                    <EditText
                                        icon={field.icon}
                                        label={field.label}
                                        value={field.value}
                                        handleChange={(e) => {
                                            setFields([
                                                ...fields.slice(0, idx),
                                                {
                                                    ...field,
                                                    value: e.target.value,
                                                },
                                                ...fields.slice(idx + 1)
                                            ]);

                                            console.log(fields.slice(0, idx));
                                            console.log(fields.slice(idx + 1));
                                        }}
                                        errorText={field.errorText}
                                        key={field.label + field.errorText}
                                        disabled = {!editInvoice}
                                    />
                                )}
                                <Button
                                    text="UPDATE"
                                    color={Color.WHITE}
                                    bgColor={Color.BLACK} 
                                    actionHandler={requestUpdateInvoice}
                                />
                            </div>
                        </section>
                    }
                </div>
            </Main>
            
        </>
    )
}

function InvoiceDetails({
    invoice,invoiceId,
}:{
    invoice:IInvoices | any,invoiceId:number,
}) {

    const router = useRouter();

    const inforBars: {label: string, key: "invoiceId" | "homestayId" | "name" | "numPeople" | "address"| "create" | "checkIn"  | "checkOut" | "updateOn" | "total" | "fullName" | "email" |
    "phoneNumber" | "status", icon: string}[] = [
        // {label: "Room", key: "name", icon: "house-user"},
        {label: "Address", key: "address", icon: "map-location-dot"},
        {label: "CheckIn", key: "checkIn", icon: "calendar-check"},
        {label: "CheckOut", key: "checkOut", icon: "angles-left"},
        {label: "Update On", key: "updateOn", icon: "pen-to-square"},
        {label: "Number of People", key: "numPeople", icon: "9"},
        {label: "Total", key: "total", icon: "circle-dollar-to-slot"},
        {label: "Full Name", key: "fullName", icon: "address-card"},
        {label: "Email", key: "email", icon: "at"},
        {label: "Phone", key: "phoneNumber", icon: "phone"},
        // {label: "Status", key: "status", icon: "flag"},
    ];

    return(
        <section  className="ml-30 w-2/5 p-3 h-full pt-10 flex flex-col  border-2 rounded-l-sm bg-gray-50 shadow-xl gap-6">
            <section className="mb-4">
                <div className="mx-auto relative w-full h-28">
                    <Image
                        className="object-contain"
                        src="/images/invoice1.png"
                        fill
                        alt="welcome illustration"
                    />                        
                </div>
            </section>
            <div className="flex flex-col gap-3"> 
                <button className="flex px-3 items-center h-10 bg-gray-100 rounded-md hover:bg-gray-200" onClick={() => router.push(`../homestays/${invoice.homestayId}`)}>
                    <span className=""><Icon name="house-user" size="xl" /></span>
                    <span className="font-bold ml-4">Room</span>
                    <span className="ml-20 font-bold text-xl text-cyan-800">{invoice.name}</span>
                </button>
                {inforBars.map(infoBar =>
                    <InfoBar
                        key={infoBar.key}
                        label={infoBar.label}
                        value={invoice?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
            <div className="flex -mt-3 px-3 place-items-center h-10 bg-gray-100 rounded-md hover:bg-gray-200">
                <span className="w-8"><Icon name="flag" size="xl" /></span>
                <span className="w-28 font-bold ">Status</span>
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
            </div>  
            
        </section>
    )
}
