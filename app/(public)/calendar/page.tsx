'use client';
import { IHomesCanlendar, getHomesCalendar } from "@/api/public";
import Header from "@/components/Header";
import { Button } from "@/layouts/DashboardHeader";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import usePopup from "@/utils/hooks/usePopup";
import { useEffect, useState } from "react";

export default function Page(){

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const [yearInput, setYearInput] = useState(year.toString());
    const [monthInput, setMonthInput] = useState((month+1).toString());
    // const [homestays, setHomestays] = useState([]);
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [homesCalendar,setHomesCalendar] = useState<IHomesCanlendar[]>([]);

    useEffect(() =>{
        fetchCalendar();
    },[year,month])

    async function fetchCalendar() {
        try {
            showLoading();
            const {data: res} = await getHomesCalendar(year,month+1);
            setHomesCalendar(res);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const getDaysInMonth = (year:any, month:any) => new Date(year, month + 1, 0).getDate();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getHomestaysForDay = (day:any) => {
        return homesCalendar.filter(hs => parseInt(hs.date.split('/')[0]) === day);
    };

    const popup = usePopup();

    return(
        <>
            <Header />
            <section className="h-full border-t-2 p-4 bg-slate-300">
                <div className="w-full mx-auto h-full p-3 bg-white border-2 rounded-md">
                    <div className="flex">
                        <div>
                            <span className="w-40 font-bold">YEAR: </span>
                            <input className="pl-2 bg-transparent border-l-2 w-20" name="Year" placeholder="Ex: 2023" type="text"
                                onChange={(event:any) => {
                                    const valueInput = event.target.value;
                                    setYearInput(valueInput)
                                    const value = Number.parseInt(event.target.value);
                                    if(!Number.isNaN(value))
                                        setYear(value);
                                }}
                            value={yearInput} 
                            />
                        </div>
                        <div>
                            <span className="w-40 font-bold ml-6">MONTH: </span>
                            <input className="pl-2 bg-transparent border-l-2 w-20" name="Year" placeholder="Ex: 2023" type="text"
                                onChange={(event:any) => {
                                    const valueInput = event.target.value;
                                    setMonthInput(valueInput)
                                    const value = Number.parseInt(event.target.value);
                                    if (!Number.isNaN(value))
                                        setMonth(value -1);
                                }}
                            value={monthInput} 
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
                                <div key={`day-${day}`} className={`text-center ${getHomestaysForDay(day).length > 0 ? 'bg-green-500 p-3 text-white rounded-xl m-7 cursor-pointer' : 'p-10'}`}
                                onClick={() => popup.show(
                                    <ShowCalendar hidePopup ={popup.hide} homesCalendar={homesCalendar} chooseDate={day+"/"+monthInput+"/"+year} />
                                )}
                                >
                                {day}
                                {/* {getHomestayForDay(day) && (
                                    <div className="text-sm">{getHomestayForDay(day)?.name}</div>
                                )} */}
                                {/* {getHomestaysForDay(day).map(hs => (
                                    <div key={hs.name} className="text-sm">{hs.name}</div>
                                ))} */}
                                </div>
                            ))}
                        </div> 
                    </div> 
                </div>
            </section>
        </>
    )
}

function ShowCalendar({
    hidePopup,
    homesCalendar,
    chooseDate,
}:{
    hidePopup: () => void,
    homesCalendar:IHomesCanlendar[],
    chooseDate:string,
}) {
    
    
// Tách ngày, tháng và năm
    var parts = chooseDate.split('/');
    var day = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var year = parseInt(parts[2]);
    // Thêm số 0 vào trước ngày và tháng nếu cần
    var formattedDay = (day < 10) ? '0' + day : day;
    var formattedMonth = (month < 10) ? '0' + month : month;
    // Chuỗi kết quả
    var formattedDate = formattedDay + '/' + formattedMonth + '/' + year;

    const calendarDate = homesCalendar.filter((home) => home.date === formattedDate);

    console.log(calendarDate);

    return(
        <section className="flex flex-col gap-5 w-96 py-5 bg-white border-4 border-gray-200 rounded-md zoom-in">
            <h2 className="font-bold text-xl mx-auto text-slate-600">{formattedDate}</h2>
            {
                calendarDate.map((calendar) =>
                    <div className="flex flex-col m-4">
                        <div className="flex">
                            <p className="font-bold">Room: {calendar.name} --{">"} </p>
                            {
                                calendar.type == false ? (<p className="italic bg-green-400 px-2">Check In</p>) : (<p className="italic bg-red-400 px-2">Check Out</p>)
                            }
                        </div>
                        <p className="italic border-b-2 border-b-red-100">Address: {calendar.address}</p>
                    </div>
                )
            }
            
            <div className="flex justify-center gap-3">
                <Button
                text="X"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    hidePopup();
                }}
                />
            </div>
        </section>
    )
} 
