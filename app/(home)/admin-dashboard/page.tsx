'use client';
import Header from "@/layouts/Header"; 
import useActiveNav from "@/utils/hooks/useActiveNav";
import { useEffect } from "react";

export default function Page() {
    const [_, setActiveNav] = useActiveNav();
    useEffect(() => {
        setActiveNav("Home");
    }, []);
    return (
        <section className="w-full flex flex-col">
            <Header> 
            </Header>
            <main className="h-full border-t-2 bg-gray-100">
                <main className="w-full h-full p-4">
                    <div className="w-full h-full bg-white border-2 rounded-md">

                    </div>
                </main>
            </main>
        </section>  
    )
}