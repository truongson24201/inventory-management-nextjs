'use client';
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {clientUrls} from "@/utils/constants/urls";

import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { login } from "@/api/auth";
import Form, { Button, Input } from "../../admin-login/Form";

export default function Page({
    params
}: {
    params: {id: string}
}) { 
    const router = useRouter();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState<{username: false | string, password: false | string}>({
        username: false,
        password: false,
    });

    const searchParams = useSearchParams();
    const homestayId = Number.parseInt(params.id);
    const address = searchParams.get("address");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    


    // Xu ly
    async function handleLogin(e: FormEvent) {
        e.preventDefault();

        try {
            showLoading();
            const { data } = await login(credentials.username, credentials.password);
            localStorage.setItem("token", data);
            console.log("data");
            // console.log(data);
            router.push(`../homestays/${homestayId}/?address=${address}&checkIn=${checkIn}&checkOut=${checkOut}`);
        }
        catch(error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    return (
        <>
            {/* <ImageGroup
                srcs={["/images/homestay-sapa.jpg", "/images/homestay-phan-thiet-binh-thuan.jpg"]}
            /> */}
            <Form
                src="/vendors/welcome.svg"
                title="Login Account"
                handleSubmitForm={handleLogin}
            >
                <Input
                    icon="user"
                    label="Identifier"
                    placeholder="Username"
                    error={errors.username}
                    value={credentials.username}
                    handleChangeInput={e => setCredentials({...credentials, username: e.target.value})}
                />
                <Input
                    icon="key"
                    label="Password"
                    placeholder="Your password"
                    type="password"
                    error={errors.password}
                    value={credentials.password}
                    handleChangeInput={e => setCredentials({...credentials, password: e.target.value})}
                />
                <Button text="Log in" />
            </Form> 
        </>
    )
}