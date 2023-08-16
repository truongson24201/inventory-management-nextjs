'use client'
import { IBranchesPublic, getBranchesAddress } from "@/api/public";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Search({
  branchIdParam,
  addressParam,
  checkInParam,
  checkOutParam,
  numParam,
} :{
  branchIdParam:any,
  addressParam:any,
  checkInParam:any,
  checkOutParam:any,
  numParam:any,
}) {

    const router = useRouter();
    const [branches, setBranches] = useState<IBranchesPublic[]>([]);
    const [address, setAdress] = useState(addressParam);
    const [branchId,setbranchId] = useState(branchIdParam);
    const [checkIn,setCheckIn] = useState(checkInParam);
    const [checkOut,setCheckOut] = useState(checkOutParam);
    const [numPeople,setNumPeople] = useState(numParam);


    
  useEffect(() =>{
    if (address) {
      fetchBranches();
    }else {
      setBranches([]);
    }
  },[address])

  const fetchBranches = async () => {
    try {
        const {data} = await getBranchesAddress(address);
        setBranches(data)
    }
    catch (error) {
        console.log(error);
    }
  }

  const handleSelectBranch = (branch:IBranchesPublic) => {
    setbranchId(branch.branchId);
    setAdress(branch.address);
    setBranches([]);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Định dạng tháng và ngày thành chuỗi 2 chữ số
    const motha = month < 10 ? '0' + month : month;
    const daya = day < 10 ? '0' + day : day;
    return `${year}-${motha}-${daya}`;
  };

  const getMinCheckOutDate = () => {
    // if (!checkIn) return getCurrentDate(); // Không có ngày checkIn thì không có ngày tối thiểu cho checkOut
    const checkInDate = new Date(checkIn);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return formatDate(nextDay);
  };

  const formatDate = (date:any) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return(
    <section>
        <div className="sm:mx-auto mt-20 justify-center sm:w-full sm:flex">
              <input
                type="text"
                className="block w-1/3 border border-transparent rounded-md px-5 py-3 text-base text-background shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-active"
                placeholder="Enter address or tourist"
                value={address}
                onChange={(event:any) => {
                  setAdress(event.target.value);
                }}
                />
                {branches.length > 0 && (
                  <div className="w-1/3 mt-12 border border-gray-300 rounded-lg absolute bg-white z-10">
                    {branches.map(result => 
                      <div className="px-5 py-3 hover:bg-blue-100" 
                        key={result.branchId}
                        onClick={() => handleSelectBranch(result)}>
                        {result.address}
                      </div>
                    )}
                  </div>
                )}
            </div>
            <div className="mt-4 w-full sm:mx-auto lg:mx-0">
            <div className="flex flex-col md:flex-row justify-center md:space-x-4 font-medium ">
              <input type="date" className="px-4 py-2 rounded-l-lg bg-gray-200 text-gray-800 dark:text-white lg:hover:text-cyan-500 focus:outline-none  focus:bg-gray-200  focus:text-cyan-500 mr-2  mb-2 md:mb-0 md:w-1/6" 
                onChange={(event:any) => {
                  const value = event.target.value;
                  setCheckIn(value);
                }}
                value={checkIn}
                min={getCurrentDate()} 
              />
              <input type="date" className="px-4 py-2 bg-gray-200 text-gray-800 dark:text-white lg:hover:text-cyan-500 focus:outline-none  focus:bg-gray-200  focus:text-cyan-500 text-sm lg:px-5 lg:py-2.5 mr-2  mb-2 md:mb-0 md:w-1/6" 
                onChange={(event:any) => {
                  const value = event.target.value;
                  setCheckOut(value);
                }}
                value={checkOut}
                min={getMinCheckOutDate()} 
                disabled ={!checkIn}
              />
              <input type="number" min="1" className="px-4 py-2 rounded-r-lg bg-gray-200 focus:outline-none focus:ring focus:border-blue-300 mb-2 md:mb-0 md:w-1/6" placeholder="Guests" 
                onChange={(event:any) => {
                  const value = event.target.value;
                  setNumPeople(value);
                }}
                value={numPeople}
              />
              {/* <button className="px-6 py-3 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900 md:w-1/6"> */}
                <Link className="px-6 py-3 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900 md:w-1/6 flex justify-center items-center"
                  href={{
                  pathname: "homestays/",
                  query: {
                      branchId: branchId,
                      checkIn: checkIn,
                      checkOut: checkOut,
                      numPeople: numPeople,
                      address:address,
                  }
              }}>Find Homestays</Link>
              {/* </button> */}
            </div>
            </div>
    </section>
  )
}