'use client';
import Form, { Button, Input } from "./Form";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {adminUrls} from "@/utils/constants/urls";
import ImageGroup from "./ImageGroup";

import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { login } from "@/api/auth";

export default function Page() { 
    const router = useRouter();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [credentials, setCredentials] = useState({
        username: 'sondinh24201',
        password: 'fbuLPnkeJg',
    });
    const [errors, setErrors] = useState<{username: false | string, password: false | string}>({
        username: false,
        password: false,
    });

    // Xu ly
    async function handleLogin(e: FormEvent) {
        e.preventDefault();

        try {
            showLoading();
            const { data } = await login(credentials.username, credentials.password);
            localStorage.setItem("token", data);
            console.log("data");
            // console.log(data);
            router.push(adminUrls.Home);
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
            <ImageGroup
                srcs={["/images/homestay-sapa.jpg", "/images/homestay-phan-thiet-binh-thuan.jpg"]}
            />
            <Form
                src="/vendors/welcome.svg"
                title="Login Admin-Manager Account"
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