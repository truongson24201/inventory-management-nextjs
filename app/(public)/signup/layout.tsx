import AdminHeader from "@/app/(log-in)/admin-login/HomeHeader";
import Header from "@/app/(log-in)/admin-login/HomeHeader";
import Link from "next/link";

export default function Layout({
    children
}: {
    children: React.ReactNode,
}) {
    return (
        <>
            <section className="container h-full flex justify-between items-center">
                <Link href="http://localhost:3000/" className="flex items-center">
                    <img src="/images/logo1.png" className="mr-3 h-6 sm:h-14" alt="Flowbite Logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Booking</span>
                </Link>
            </section>
			<main className="mx-auto max-w-[1200px] flex items-center justify-center ">
				<section className="w-full h-[600px] flex gap-8 p-8 bg-gray-100 shadow-md rounded-lg ">
					{children}
                </section>
			</main>
        </>
    )
}