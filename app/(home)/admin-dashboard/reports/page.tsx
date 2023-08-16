'use client';

import { ITotalOfYear, getTotalOfYear } from "@/api/chart";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

export default function Page() {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const notify = useNotification();

    const [totalOfYear, setTotalOfYear] = useState<ITotalOfYear[]>([]);
    const [year,setYear] = useState(2023);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

    const data = {
        labels: totalOfYear.map(item => monthNames[item.month - 1]), // Thay bằng thuộc tính tương ứng của totalOfYear
        datasets: [
            {
                label: 'total $',
                data: totalOfYear.map(item => item.total), // Thay bằng thuộc tính tương ứng của totalOfYear
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    useEffect(()=>{
        fetchTotalOfYear();
    },[year])

    const fetchTotalOfYear = async () =>{
        try {
            const {data:totalOfYearRes} = await getTotalOfYear(year);
            setTotalOfYear(totalOfYearRes);
        } catch (error) {
            
        }
    }


    return (
        <section className="w-full flex flex-col">
        <Header>
                
        </Header>
        <Main>
            <div className="w-full md:col-span-2 relative h-full m-auto p-4 border rounded-lg bg-white">
                <div>
                    <span className="w-40 font-bold">YEAR: </span>
                    <input className="pl-2 bg-transparent border-l-2" name="Year" placeholder="Ex: 2023" type="text"
                    onChange={(event:any) => {
                        const value = event.target.value;
                        setYear(value);
                      }}
                    value={year} 
                    />
                </div>
                <div className="w-1/2">
                    <Bar data={data} options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }} />
                </div>
            </div>
        </Main>
        </section>
        
    )
}