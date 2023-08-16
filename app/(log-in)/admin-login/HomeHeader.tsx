import Logo from "@/components/Logo";
import Link from "next/link";
import { HomeUrls } from "@/utils/constants/urls";

export default function AdminHeader() {
    return (
        <header className="fixed inset-x-0 top-0 h-14 bg-gray-700 text-white shadow-md z-20">
            <section className="container h-full flex justify-between items-center">
                <Link href={HomeUrls.Home}>
                    <Logo />
                </Link>
                <nav className="flex gap-6 items-center">
                    <Link href={HomeUrls.AdminLogin}>Admin Log-in</Link>
                </nav>
            </section>
        </header>
    ) 
}