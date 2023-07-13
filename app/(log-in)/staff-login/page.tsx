'use client';
import Form, { Button, Input } from "../Form";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {HomeUrls, adminUrls, staffUrls} from "@/utils/constants/urls";
import ImageGroup from "../ImageGroup";

import useLoadingAnimation, { Spinner } from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";

export default function Page() { 
    const router = useRouter();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [credentials, setCredentials] = useState({
        email: 'eve.holt@reqres.in',
        password: '',
    });
    const [errors, setErrors] = useState<{email: false | string, password: false | string}>({
        email: false,
        password: false,
    });


    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        router.push(adminUrls.Home);
    }

    return (
        <>
            <ImageGroup
                srcs={["/staff-log-in/2.jpg", "/staff-log-in/1.jpg"]}
            />
            <Form
                src="/vendors/welcome.svg"
                title="Login Staff Account"
                handleSubmitForm={handleLogin}
            >
                <Input
                    icon="user"
                    label="Identifier"
                    placeholder="N19DCCN001"
                    error={errors.email}
                    value={credentials.email}
                    handleChangeInput={e => setCredentials({...credentials, email: e.target.value})}
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