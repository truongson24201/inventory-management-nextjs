'use client'
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import EditText from "@/components/EditText";
import Header, { Button } from "@/layouts/DashboardHeader"
import Main from "@/layouts/DashboardMain"
import { Color } from "@/utils/constants/colors"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useNotification from "@/utils/hooks/useNotification";
import { getAllRoles } from "@/api/role";
import DropDown, { IDropdownData } from "@/components/DropDown";
import { createAccount } from "@/api/account";
import { createHomestay } from "@/api/homestay";
import { createMenuItem, CUMenuItemReq, getAllCategory } from "@/api/menu";


export default function Page() {

    const router = useRouter();
    const notify = useNotification();
    const [image, setImage] = useState<File | null>(null);
    const [menuItemCategory, setMenuItemCategory] = useState<IDropdownData[]>([]);
    const [menuItemCategoryId, setMenuItemCategoryId] = useState("");
    const [menuItemGroup, setMenuItemGroup] = useState<IDropdownData[]>([
        { text: 'Food', value: 'FOOD' },
        { text: 'Beverage', value: 'BEVERAGE' },
    ]);

    const [info, setInfo] = useState<CUMenuItemReq>({
        menuItemId: 0,
        menuItemName: "",
        menuItemCategoryId: 1,
        menuItemGroup: "FOOD",
        description: "",
        isActive: true,
    });


    useEffect(() => {
        fetAllCategory();
    }, []);

    const fetAllCategory = async () => {
        try {
            const {data:res} = await getAllCategory();
            setMenuItemCategory(res.map((item: { menuItemCategoryId: any; menuItemCategoryName: any; }) => ({
                text: item.menuItemCategoryName,
                value: item.menuItemCategoryId,
            })));
        }
        catch (error) {
            console.log(error);
        }
    }

    const requestCreateMenuItem = async () => {
        try {
            await createMenuItem(image, info);
            router.push("./");
            notify("Create a account successfully", "success");
        }
        catch (error) {
            console.log(error);
            notify("Create a account failed", "error");
        }
    }



    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="Save"
                        color={Color.WHITE}
                        bgColor={Color.GREEN}
                        actionHandler={requestCreateMenuItem}
                    />
                </div>
            </Header>
            <Main>
                <div className="w-[480px] h-full flex flex-col gap-8 p-5 mx-auto border-2 rounded-md shadow-md">
                    <Title
                        text="Create a menu item"
                        icon="plus"
                        color={Color.GREEN}
                    />
                    <input
                        type="file"
                        multiple
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImage(e.target.files[0]);
                            }
                        }}
                    />
                    <DropDown
                        label="Category"
                        dataset={menuItemCategory}
                        handleChange={e => { 
                            setInfo({ ...info, menuItemCategoryId: Number.parseInt(e.target.value )}); 
                        }}
                        icon="circle-info"
                    />
                    <DropDown
                        label="GroupName"
                        dataset={menuItemGroup}
                        handleChange={e => { setInfo({ ...info, menuItemName: e.target.value }); }}
                        icon="address-card"
                        value={info.menuItemGroup}
                    />
                    <EditText
                        icon={"signature"}
                        label={"Name"}
                        value={info.menuItemName}
                        type={"text"}
                        handleChange={(e) => { setInfo({ ...info, menuItemName: e.target.value }); }}
                        errorText={""}
                    />
                    <EditText
                        icon={"arrow-up-9-1"}
                        label={"Name"}
                        value={info.description}
                        type={"text"}
                        handleChange={(e) => { setInfo({ ...info, description: e.target.value }); }}
                        errorText={""}
                    />
                </div>
            </Main>
        </section>
    )
}