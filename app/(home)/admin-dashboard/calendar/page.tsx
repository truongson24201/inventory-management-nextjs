'use client';

import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import { useState } from "react";

import 'react-calendar/dist/Calendar.css';

import Calendar from 'react-calendar';

export default function Page(){

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    // const [homestays, setHomestays] = useState([]);
    const homestays = [
        {
          name: "Homestay A",
          date: "15/08/2023", // Month is 0-based index (0: January, 1: February, ..., 11: December)
        },
        {
          name: "Homestay B",
          date: "18/08/2023",
        },
        // Add more homestays as needed
      ];

    const getDaysInMonth = (year:any, month:any) => new Date(year, month + 1, 0).getDate();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const renderHomestayForDay = (day:any) => {
        const homestay = homestays.find(item => item.date === `${day}/${month}/${year}`);
        console.log(homestay);
        return homestay ? (
        <div className="bg-blue-300 p-2 rounded-md">
            {day} - {homestay.name}
        </div>
        ) : (
        <div className="p-2">{day}</div>
        );
    };

    // const getHomestayForDay = (day:any) => {
    //     return homestays.find(hs => parseInt(hs.date.split('/')[0]) === day);
    //   };

      const getHomestaysForDay = (day:any) => {
        return homestays.filter(hs => parseInt(hs.date.split('/')[0]) === day);
      };

    return(
        <section className="w-full flex flex-col">
            <Header>        
                
            </Header>
            <Main>
                <div className="flex">
                    <div>
                        <span className="w-40 font-bold">YEAR: </span>
                        <input className="pl-2 bg-transparent border-l-2 w-20" name="Year" placeholder="Ex: 2023" type="text"
                        onChange={(event:any) => {
                            const value = event.target.value;
                            setYear(value);
                        }}
                        value={year} 
                        />
                    </div>
                    <div>
                        <span className="w-40 font-bold ml-6">MONTH: </span>
                        <input className="pl-2 bg-transparent border-l-2 w-20" name="Year" placeholder="Ex: 2023" type="text"
                        onChange={(event:any) => {
                            const value = event.target.value;
                            setMonth(value);
                        }}
                        value={month+1} 
                        />
                    </div>
                </div>
                <div className="bg-gray-100 h-[630px] mt-6 py-4 rounded-xl">
                    <div className="grid grid-cols-7 gap-2 mx-4 ">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-semibold">{day}</div>
                        ))}
                        {Array.from({ length: firstDay }, (_, i) => (
                        <div key={`empty-${i}`}/>
                        ))}
                        {calendarDays.map(day => (
                            <div key={`day-${day}`} className={`text-center ${getHomestaysForDay(day).length > 0 ? 'bg-red-400 p-7 text-white rounded-xl m-2' : 'p-9'}`}>
                            {day}
                            {/* {getHomestayForDay(day) && (
                                <div className="text-sm">{getHomestayForDay(day)?.name}</div>
                            )} */}
                            {getHomestaysForDay(day).map(hs => (
                                <div key={hs.name} className="text-sm">{hs.name}</div>
                            ))}
                            </div>
                        ))}
                    </div> 
                </div> 
                
            </Main>
        </section>
    )
}