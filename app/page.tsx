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
import { getAllNow } from "@/api/menu";
import { IPriceMenuItemView } from "@/api/response";
// import "./clientCss.css";


export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);



  const [menus, setMenus] = useState<IPriceMenuItemView[]>([]);
  useEffect(() => {
    fetAllMenuNow();
    handleLogin();
  }, [])

  const fetAllMenuNow = async () => {
    try {
      const { data } = await getAllNow();
      setMenus(data);
    } catch (error) {
      
    }
  }

  const handleLogin = async () => {
    const token = localStorage.getItem('token');
    // console.log(token);
    if (token) {
      setIsLoggedIn(true);
      // return "Invoice/";
    } else {
      setIsLoggedIn(false);
      // return "client-login/";
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
      <video className="w-screen" src="/images/FoodReel2023.mp4" muted autoPlay loop typeof="video/mp4"></video>
      <div className="container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-center">
        {
          isLoggedIn ? (
            <Search checkInParam="" />
          ) : (
            <section>
              <div className="mt-4 w-full sm:mx-auto lg:mx-0">
                <div className="flex flex-col md:flex-row justify-center md:space-x-4 font-medium ">

                  <Link className="px-6 py-3 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900 md:w-1/6 flex justify-center items-center"
                    href={{
                      pathname: "/client-login/",
                      query: {}
                    }}>Login to book</Link>

                </div>
              </div>
            </section>
          )

        }

      </div>
      <main className="">
        <div className="flex justify-center items-center my-14">
          <div className="flex items-center w-10/12 ">
            <hr className="flex-grow border-gray-300" />
            <h2 className="px-4 text-xl font-bold">Menu</h2>
            <hr className="flex-grow border-gray-300" />
          </div>
        </div>
        <div className="flex justify-center items-center mb-16">
          <div className="w-10/12 bg-white ">
            <Carousel responsive={responsive}>
              {menus.map((menu, index) => (
                <div className="bg-gray-100 rounded-lg shadow-2xl p-4 mb-4 flex flex-col w-64 " key={index}>
                  <img className="w-full h-72 object-cover rounded-md mb-2" src={menu.menuItem.imageUrl} alt={`Slide ${index}`} />
                  <h3 className="text-lg font-bold text-red-500">{menu.menuItem.menuItemName}</h3>
                  <p className="font-bold">Category: {menu.menuItem.menuItemCategory.menuItemCategoryName}</p>
                  <p className="mt-2 text-gray-500 italic">{menu.menuItem.description}</p>
                  <button className="mt-4 py-2 rounded-lg text-white font-bold bg-cyan-600 hover:bg-cyan-900 cursor-context-menu" >
                    {menu.price.toLocaleString()} VND
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