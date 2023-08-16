'use client';
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {clientUrls} from "@/utils/constants/urls";

import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { login } from "@/api/auth";
import Form, { Button, Input } from "@/app/(log-in)/admin-login/Form";
import Image from "next/image";
import { registerAccount } from "@/api/public";
import axios from "axios";



export default function Page() { 
    const router = useRouter();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [info, setInfo] = useState({
        username:"",
        password:"",
        fullName:"",
        email:"",
        phoneNumber:"",
    });
    const [errors, setErrors] = useState<{username: false | string, password: false | string ,fullName: false | string, email: false | string,  phoneNumber: false | string}>({
        username: false,
        password: false,
        fullName: false,
        email:false,
        phoneNumber:false,
    });

    const [showPassword, setShowPassword] = useState(false);


    const requestRegisterAccount = async () =>{
        try {
            showLoading();
            await registerAccount(info.username,info.password,info.fullName,info.email,info.phoneNumber);
            // setInvoiceForm(data);
            // invoiceId = data.invoiceId;
            notify("Register Account Successfully!","success");
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
        if (info.username.trim() === '') {
            newErrors.username = 'Username is required';
        }
        if (info.password.trim() === '') {
            newErrors.password = 'Pasword is required';
        }
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
        // console.log("newErrors",newErrors);
        // Kiểm tra các thông tin khác của info nếu cần
        // console.log("errors",errors);
        if (errors.username == false && errors.password == false && errors.email == false && errors.fullName == false && errors.phoneNumber == false) {
            requestRegisterAccount();
            router.push("../client-login");
        }else {
            setErrors(newErrors);
            router.push("");
        }

      };

    return (
        <>
            <section className=" w-full max-w-xs mx-auto md:w-1/2 lg:w-1/3 pt-2 flex flex-col ">
                <section className="mb-4">
                    <div className="mx-auto relative w-full h-28">
                        <Image
                            className="object-contain"
                            src="/vendors/welcome.svg"
                            fill
                            alt="welcome illustration"
                        />                        
                    </div>
                    <h2 className="text-xl font-extrabold text-center">Register</h2>
                </section>

                <form 
                    className="relative w-[400px] h-full flex flex-col gap-3 mx-auto "
                    onSubmit={validateInput}
                >
                    <Input
                        icon="user"
                        label="username (*)"
                        placeholder="Username"
                        error={errors.username}
                        value={info.username}
                        handleChangeInput={e => {
                            setInfo({...info, username: e.target.value});
                            setErrors({...errors, username:false});
                        }}
                    />
                    <Input
                        icon="key"
                        label="Password (*)"
                        placeholder="Your password"
                        type={showPassword ? 'text' : 'password'}
                        error={errors.password}
                        value={info.password}
                        handleChangeInput={e => {
                            setInfo({...info, password: e.target.value});
                            setErrors({...errors, password:false});
                        }}
                    />
                    
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
                        Register
                    </button>
                </form>
                <button className="mt-6" onClick={() => setShowPassword((prevShow) => !prevShow)}>
                        {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
            </section>
        </>
    )
}