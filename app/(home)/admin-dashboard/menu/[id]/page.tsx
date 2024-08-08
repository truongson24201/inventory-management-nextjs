'use client';
import { getMenuDetail } from "@/api/menu";
import { IPriceMenuItemView } from "@/api/response";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import DeleteButton from "@/components/DeleteButton";
import Icon from "@/components/Icon";
import InfoBar from "@/components/InfoBar";
import Popup from "@/components/Popup";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InfoSection from "./InfoSection";
import ImagesSection from "./ImageSection";
import PricesSection from "./PriceSection";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();

    const menuItemId = Number.parseInt(params.id);
    const [menu, setMenu] = useState<IPriceMenuItemView>();
    const [menus, setMenus] = useState<IPriceMenuItemView[]>([]);
    const [section, setSection] = useState<"images" | "prices">("images");


    useEffect(() => {
        fetchMenuItemDetail();
    }, []);


    async function fetchMenuItemDetail() {
        try {
            showLoading();
            const {data} = await getMenuDetail(menuItemId);
            setMenu(data);
            setMenus(prevMenus => [...prevMenus, data]);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function removeThisHomestay() {
        try {
            showLoading();
            // await removeHomestay(menuItemId);
            router.push("./")
            notify("Remove homestay successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove homestay failed!", "error");
        }
        finally {
            hideLoading();
        }
    }



    const removeHomestayPopup = 
        <Popup text="This homestay will be REMOVE or SHUTDOWN, you're sure?">
            <Button
                text="[Remove/Shutdown]"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    removeThisHomestay();
                }}
            />
            <Button
                text="Cancel"
                color={Color.BLACK}
                bgColor={Color.WHITE} 
                actionHandler={() => {popup.hide()}}
            />
        </Popup>; 
    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Edit"
                        color={Color.WHITE}
                        bgColor={Color.ORANGE} 
                        actionHandler={() => router.push(`${menuItemId}/edit`)}
                    />
                    <Button
                        text="Remove"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(removeHomestayPopup);
                        }}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection
                        menu={menu}
                    />
                    {/* <WarehousesSection warehouses={warehouses} /> */}
                    <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
                        <div className="flex gap-4">
                            <Button
                                text=" Images"
                                color={Color.WHITE}
                                bgColor={Color.BLUE}
                                icon="images"
                                actionHandler={() => {
                                    setSection("images")
                                }}
                            />
                            <Button
                                text=" Prices"
                                color={Color.WHITE}
                                bgColor={Color.RED} 
                                icon="money-check-dollar"
                                actionHandler={() => {
                                    setSection("prices")
                                }}
                            />
                        </div>
                        {
                            section === "images" 
                            ? <ImagesSection image={menus} />
                            : <PricesSection menuItemId={menuItemId} />
                        }
                    </section>
                </div>
            </Main>
        </section>
    )
}

