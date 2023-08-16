'use client';

import Logo from "@/components/Logo";
import Link from "next/link";

import { HomeUrls } from "@/utils/constants/urls";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";


export default function Header() {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() =>{
        handleLogin();
    },[])

    const handleLogin = async () => {
        const token = localStorage.getItem('token');
        // console.log(token);
        if (token) {
            setIsLoggedIn(true);
            // return "Invoice/";
        }else {
            setIsLoggedIn(false);
            // return "client-login/";
        }
    }

    function logout() {
        showLoading();
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push("http://localhost:3000/");
        hideLoading();
    }

    return (
        <section className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                <Link href="http://localhost:3000/" className="flex items-center">
                    <img src="/images/logo1.png" className="mr-3 h-6 sm:h-14" alt="Flowbite Logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Booking</span>
                </Link>
                <div className="flex items-center lg:order-2">
                    {
                        isLoggedIn ? (
                            <header className="flex justify-end w-full px-4 h-14 items-center">
                                <section className="flex items-center gap-2 text-base"> 
                                    <div className="w-11 grid place-items-center aspect-square hover:bg-gray-100 rounded-full cursor-pointer ">
                                        <Icon name="bell" size="lg" />
                                    </div>
                                    <div className="w-11 grid place-items-center aspect-square hover:bg-gray-100 rounded-full cursor-pointer ">
                                        <Icon name="circle-question" size="lg" />
                                    </div>
                                    <div className="w-11 grid place-items-center aspect-square hover:bg-gray-100 rounded-full cursor-pointer ">
                                        <Icon name="user-circle" size="2xl" />
                                    </div>
                                    <div className="w-11 grid place-items-center aspect-square hover:bg-gray-100 rounded-full cursor-pointer "
                                    onClick={logout}
                                    >
                                        <Icon name="right-from-bracket" size="lg" />
                                    </div>
                                </section>
                            </header>
                        ) : (
                            <>
                                <Link href="http://localhost:3000/client-login/" className="text-gray-800 dark:text-white hover:bg-gray-100 lg:hover:text-cyan-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Login</Link>
                                <Link href="http://localhost:3000/signup/" className="text-white bg-cyan-600 hover:bg-cyan-900 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2  dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Sign Up</Link>
                            </>
                        )
                    }
                        
                    {/* <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                        <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button> */}
                </div>
                <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                    <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-0 lg:mt-0">
                        <li>
                            <a href="http://localhost:3000/homestays/" className="text-gray-800 dark:text-white hover:bg-gray-100 lg:hover:text-cyan-500 focus:bg-gray-200 focus:text-cyan-500 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Homestays</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-800 dark:text-white hover:bg-gray-100 lg:hover:text-cyan-500  focus:bg-gray-200 focus:text-cyan-500  font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Blogs</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-800 dark:text-white hover:bg-gray-100 lg:hover:text-cyan-500 focus:bg-gray-200 focus:text-cyan-500 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Contract</a>
                        </li>
                        <li>
                            {
                                isLoggedIn ? 
                                <a href="http://localhost:3000/calendar/" className="text-gray-800 dark:text-white hover:bg-gray-100 lg:hover:text-cyan-500 focus:bg-gray-200 focus:text-cyan-500 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Calendar</a>
                                :
                                <a href="http://localhost:3000/client-login/" className="text-gray-800 dark:text-white hover:bg-gray-100 lg:hover:text-cyan-500 focus:bg-gray-200 focus:text-cyan-500 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Calendar</a>
                            }
                        </li>
                        <li>
                            {
                                isLoggedIn ? 
                                <a href="http://localhost:3000/invoices/" className="text-gray-800 dark:text-white hover:bg-gray-100 lg:hover:text-cyan-500 focus:bg-gray-200 focus:text-cyan-500 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Invoices</a>
                                :
                                <a href="http://localhost:3000/client-login" className="text-gray-800 dark:text-white hover:bg-gray-100 lg:hover:text-cyan-500 focus:bg-gray-200 focus:text-cyan-500 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Invoices</a>
                            }
                        </li>
                    </ul>
                </div>
            </div>
    </section>
    ) 
}