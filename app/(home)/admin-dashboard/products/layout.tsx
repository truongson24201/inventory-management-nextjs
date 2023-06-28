'use client'; 
import Header from "@/layouts/Header"; 

export default function Layout({
    children
}: {
    children: React.ReactNode
}) { 

    return ( 
        <section className="w-full flex flex-col">
            <Header> 
            </Header>
            <main className="h-full border-t-2 bg-gray-100">
                {children}
            </main>
        </section>     
    )
}