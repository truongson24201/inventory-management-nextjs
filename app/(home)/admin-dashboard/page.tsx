'use client';
import { INumInvoices, IRanks, ITotalBooking, getNewInvoices, getPendingInvoices, getRanks, getTotalActive, getTotalBooking, getTotalCancel } from "@/api/chart";
import Title from "@/components/DashboardTitle";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { Color } from "@/utils/constants/colors";
import useActiveNav from "@/utils/hooks/useActiveNav";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

export default function Page() {
    const [_, setActiveNav] = useActiveNav();
    const router = useRouter();
    const [newInvoices, setNewInvoices] = useState<INumInvoices>();
    const [pendingInvoices, setPendingInvoices] = useState<INumInvoices>();
    const [ranks,setRanks] = useState<IRanks[]>([]);
    const [totalBooking, setTotalBooking] = useState<ITotalBooking>();
    const [totalActive, setTotalActive] = useState<ITotalBooking>();
    const [totalCancel, setTotalCancel] = useState<ITotalBooking>();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const notify = useNotification();  


    const getLastMonth = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        // Định dạng tháng và ngày thành chuỗi 2 chữ số
        const motha = month < 10 ? '0' + month : month;
        const daya = day < 10 ? '0' + day : day;
        return `${year}-${motha}-${daya}`;
    };

    const [from,setFrom] = useState(getLastMonth());
    const [to,setTo] = useState("");

    useEffect(() =>{
        setActiveNav("Home");
    })

    useEffect(() => {
        fetchNumInvoices();
    }, []);
    
    useEffect(() =>{
        fetchTotalBooking();
    },[from,to])


    const fetchNumInvoices =  async () => {
        try {
            showLoading();
            const {data} = await getNewInvoices();
            const {data:old} = await getPendingInvoices();
            const {data:rankRes} = await getRanks();
            setRanks(rankRes);
            setNewInvoices(data);
            setPendingInvoices(old);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const fetchTotalBooking =  async () => {
        try {
            showLoading();
            const {data:total} = await getTotalBooking(from,to);
            const {data:active} = await getTotalActive(from,to);
            const {data:cancel} = await getTotalCancel(from,to);
            setTotalBooking(total);
            setTotalActive(active);
            setTotalCancel(cancel);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }
    
   

    return (
        <section className="w-full flex flex-col">
            <Header>
                
            </Header>
            <Main>
            <div className="flex">
                <div className="flex flex-col w-2/3 ">
                    <h2 className="text-start ml-4 font-semibold text-3xl text-gray-700 mb-4">Dashboard</h2>
                    <div className="flex space-x-10 justify-start mt-4 ml-4 h-28">
                        <button className="bg-gray-200 hover:bg-blue-300 text-purple-700 font-semibold w-1/3  rounded"
                            onClick={() => {router.push("admin-dashboard/invoices/")}}
                            >
                            <p className="text-sm">New Booking</p>
                            <p className="text-lg">{newInvoices?.amount}</p>
                        </button>
                        <button className="bg-gray-200 hover:bg-blue-300 text-pink-700 font-semibold w-1/3 rounded"
                            onClick={() => {router.push("admin-dashboard/invoices/")}}>
                            <p className="text-sm">Refund Booking</p>
                            <p className="text-lg">{pendingInvoices?.amount}</p>
                        </button>
                        <button className="bg-gray-200 hover:bg-blue-300 text-fuchsia-700 font-semibold w-1/3 rounded">
                            <p className="text-sm">Rating & Review</p>
                            <p className="text-lg">42</p>
                        </button>
                    </div>

                    <div className="flex mt-10 ml-4 items-center gap-4">
                        <h2 className="text-start  font-semibold text-3xl text-gray-700 mb-4">Booking analytics</h2>
                        <p>FROM:</p>
                        <input type="date" className=" bg-gray-100 rounded-lg focus:text-cyan-500 lg:hover:text-cyan-500 outline-none" 
                            onChange={(event:any) => {
                                const value = event.target.value;
                                setFrom(value);
                            }}
                            value={from}
                        />
                        <p>TO:</p>
                        <input type="date" className=" bg-gray-100 rounded-lg focus:text-cyan-500 lg:hover:text-cyan-500 outline-none" 
                            onChange={(event:any) => {
                                const value = event.target.value;
                                setTo(value);
                            }}
                            value={to}
                            min={from} 
                            disabled ={!from} 
                        />
                    </div>
                    
                    <div className="flex space-x-10 justify-start mt-4 ml-4 h-28">
                        <button className="bg-gray-200 hover:bg-blue-300 text-purple-700 font-semibold w-1/3 rounded"
                            onClick={() => {router.push("admin-dashboard/invoices/")}}
                            >
                            <p className="text-sm">Total Bookings</p>
                            <p className="text-lg">{totalBooking?.invoiceCount}</p>
                            <p>${totalBooking?.total}</p>
                        </button>
                        <button className="bg-gray-200 hover:bg-blue-300 text-green-700  font-semibold w-1/3 rounded"
                            onClick={() => {router.push("admin-dashboard/invoices/")}}>
                            <p className="text-sm">Active Bookings</p>
                            <p className="text-lg">{totalActive?.invoiceCount}</p>
                            <p>${totalActive?.total}</p>
                        </button>
                        <button className="bg-gray-200 hover:bg-blue-300 text-pink-700 font-semibold w-1/3 rounded">
                            <p className="text-sm">Cancelled Bookings</p>
                            <p className="text-lg">{totalCancel?.invoiceCount}</p>
                            <p>${totalCancel?.total}</p>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col ml-10 bg-slate-100 border-2 rounded-md w-1/3 shadow-xl">
                    <div className="flex">
                        <h2 className="text-start ml-4 font-semibold text-3xl text-gray-700 mb-4">Ranks</h2>
                    </div>
                    {ranks.map((rank,index) => (
                        <div className="mx-4 rounded-xl mt-4 bg-gray-200 py-2">
                            <div className="flex gap-4 -ml-2">
                                <div className=" bg-violet-200 w-10 ml-4 p-6 rounded-xl flex justify-center items-center">
                                    <Icon name={(index +1).toString()} size="lg" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-semibold">{rank.name}</p>
                                    <p className="text-green-800 italic">${rank.total}</p>
                                </div>
                            </div>  
                        </div>
                    ))
                    }
                </div>
            </div>
            </Main>
        </section>  
    )
}