'use client'
import { IBranchesPublic, IHomesPublic, getBranchesAddress, getHomesPublic } from "@/api/public";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Search from "@/components/Search";
import useNotification from "@/utils/hooks/useNotification";
import Footer from "@/components/footer";
import Carousel from "react-multi-carousel";
  import "react-multi-carousel/lib/styles.css";
import axios from "axios";
// import "./clientCss.css";


export default function Home() {

  // const router = useRouter();
  // const [branches, setBranches] = useState<IBranchesPublic[]>([]);
  // const [address, setAdress] = useState("");
  // const [branchId,setbranchId] = useState(0);
  // const [checkIn,setCheckIn] = useState();
  // const [checkOut,setCheckOut] = useState();
  // const [numPeople,setNumPeople] = useState(1);
  


  // useEffect(() =>{
  //   if (address) {
  //     fetchBranches();
  //   }else {
  //     setBranches([]);
  //   }
  // },[address])

  // const fetchBranches = async () => {
  //   try {
  //       const {data} = await getBranchesAddress(address);
  //       setBranches(data)
  //   }
  //   catch (error) {
  //       console.log(error);
  //   }
  // }

  // const handleSelectBranch = (branch:IBranchesPublic) => {
  //   setbranchId(branch.branchId);
  //   setAdress(branch.address);
  //   setBranches([]);
  // };

  

  const [homes, setHomes] = useState<IHomesPublic[]>([]);
  console.log(homes);
  useEffect(() =>{
    fetchHomePublic();
  },[])

  const fetchHomePublic = async () =>{
    try {
      const {data} = await getHomesPublic();
      setHomes(data);
      console.log(homes);
    } catch (error) {
      // if(axios.isAxiosError(error)){
        
      // }
    }
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };


  return (
    <>
      <Header />
          <video className="w-screen" src="/images/WelcometoVietnam.mp4" muted autoPlay loop typeof="video/mp4"></video>
          <div className="container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-center">
            <Search branchIdParam={0} addressParam="" checkInParam="" checkOutParam="" numParam={1} />
            
          </div>
      <main className="">
          <div className="flex justify-center items-center my-14">
            <div className="flex items-center w-10/12 ">
              <hr className="flex-grow border-gray-300"/>
              <h2 className="px-4 text-xl font-bold">Homestays</h2>
              <hr className="flex-grow border-gray-300"/>
            </div>
          </div>
          <div className="flex justify-center items-center mb-16">
            <div className="w-10/12 bg-white ">
              <Carousel responsive={responsive}>
                {homes.map((home, index) => (
                  <div className="bg-gray-100 rounded-lg shadow-2xl p-4 mb-4 flex flex-col w-64 " key={index}>
                    <img className="w-full h-72 object-cover rounded-md mb-2" src={home.image} alt={`Slide ${index}`} />
                    <h3 className="text-lg font-bold text-red-500">{home.name}</h3>
                    <p className="mt-2 text-gray-500 italic">{home.address}</p>
                    <p className="font-bold">Price: ${home.price}</p>
                    <button className="mt-4 py-2 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900" >
                        Details
                    </button>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
      </main>
      <Footer />
    </>
  )
}