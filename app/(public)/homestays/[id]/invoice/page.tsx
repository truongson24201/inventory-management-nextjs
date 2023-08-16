'use client';

import Image from "next/image";
import { IInvoices, createInvoice, getInvoiceForm } from "@/api/client";
import { Button, Input } from "@/app/(log-in)/admin-login/Form";
import Header from "@/components/Header";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Page({
    params
}: {
    params: {id: string}
}) {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification(); 
    const searchParams = useSearchParams();
    const homestayId = Number.parseInt(params.id);
    const address = searchParams.get("address");
    const checkIn= searchParams.get('checkIn')?.toString() ?? "";
    const checkOut = searchParams.get('checkOut')?.toString() ?? "";


    const [invoiceForm, setInvoiceForm] = useState<IInvoices>();

    const [info, setInfo] = useState({
        fullName:"",
        email:"",
        phoneNumber:"",
    });
    const [errors, setErrors] = useState<{fullName: false | string, email: false | string,  phoneNumber: false | string}>({
        fullName: false,
        email: false,
        phoneNumber:false,
    });
    // console.log("errors",errors);

    useEffect(()=>{
        fetchInvoiceForm();
    },[])

    const fetchInvoiceForm = async () =>{
        try {
            showLoading();
            const {data} = await getInvoiceForm(homestayId,checkIn,checkOut);
            setInvoiceForm(data);
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

    const createThisInvoice = async () =>{
        try {
            showLoading();
            const {data} = await createInvoice(homestayId,info.fullName,info.email,info.phoneNumber,checkIn,checkOut);
            // setInvoiceForm(data);
            notify("Booking this homestay Successfully!","success");
            router.push(`../../invoices/${data.invoiceId}`);
        } catch (error) {
            if(axios.isAxiosError(error)){
                notify(error.response?.data,"error");
            }
        }
        finally{
            hideLoading();
        }
    }

    const validateInput = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log("info --", info);
        // console.log("errors",errors);
        const newErrors = errors;
        if (info.fullName.trim() === '') {
            newErrors.fullName = 'Fullname is required';
        }
        if (info.email.trim() === '') {
            newErrors.email = 'Email is required';
        }
        // Kiểm tra phoneNumber
        if (info.phoneNumber.trim() === '') {
            newErrors.phoneNumber = 'Phone Number is required';
        }
        // Kiểm tra các thông tin khác của info nếu cần
        // console.log("errors",errors);
        if (errors.email == false && errors.fullName == false && errors.phoneNumber == false) {
            createThisInvoice();
        }else {
            setErrors(newErrors);
            router.push("");
        }

      };
    

    return(
        <>
            <Header />
            <section className=" mx-auto md:w-1/2 lg:w-1/3 pt-10 flex flex-col bg-gray-50 shadow-xl rounded-lg  h-[676px]  gap-8 p-8 ">
                <section className="mb-4">
                    <div className="mx-auto relative w-full h-28">
                        <Image
                            className="object-contain"
                            src="/images/invoice1.png"
                            fill
                            alt="welcome illustration"
                        />                        
                    </div>
                    <h2 className="text-xl font-extrabold text-center">Enter information</h2>
                </section>

                <form 
                    className="relative w-[400px] h-full flex flex-col gap-3 mx-auto "
                    onSubmit={validateInput}
                >
                    <h2 className="font-bold mb-2 text-2xl text-cyan-800">Homestay: {invoiceForm?.name}</h2>
                    <p className="">Address: {invoiceForm?.address}</p>
                    <div className="rounded-lg bg-red-100 text-gray-800 pl-2">
                        Check In: {checkIn} ---{">"} Check Out: {checkOut}
                    </div>
                    <p className="">Number of people: {invoiceForm?.numPeople}</p>
                    <p className="mb-2 text-red-700 font-bold">Total price: ${invoiceForm?.total}</p>
                    <Input
                        icon="file-signature"
                        label="Full Name (*)"
                        placeholder="Your fullname"
                        error={errors.fullName}
                        value={info.fullName}
                        handleChangeInput={e => {
                            setInfo({...info, fullName: e.target.value});
                            setErrors({...errors, fullName:false});
                        }}
                    />  
                    <Input
                        icon="at"
                        label="Email (*)"
                        placeholder="Your email"
                        error={errors.email}
                        value={info.email}
                        handleChangeInput={e => {
                            setInfo({...info, email: e.target.value});
                            setErrors({...errors, email:false});
                        }}
                    />
                    <Input
                        icon="phone"
                        label="Phone Number (*)"
                        placeholder="Your phone number"
                        error={errors.phoneNumber}
                        value={info.phoneNumber}
                        handleChangeInput={e => {
                            setInfo({...info, phoneNumber: e.target.value});
                            setErrors({...errors, phoneNumber:false});
                        }}
                    />
                    <button className="mt-4 w-full left-0 right-0 bottom-0 h-10 rounded-md bg-blue-400 text-white font-bold"
                    // onClick={validateInput}
                    >
                       Submit
                    </button>
                </form>
            </section>
        </>
    );

}