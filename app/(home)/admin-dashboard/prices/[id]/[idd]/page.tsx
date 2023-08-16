'use client';
import { IHomestayResponse } from "@/api/homestay";
import { IHomesPricesResponse, IPricesResponse, addHomestayInOf, getHomesCombobox, getHomesInOfPrice, getPriceDetails, removeHomestayOutOf, removePrice } from "@/api/price";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import DeleteButton from "@/components/DeleteButton";
import DropDown, { ICheckBox, IDropdownData } from "@/components/DropDown";
import EditText from "@/components/EditText";
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
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";

export default function Page({
    params
}: {
    params: {idd: string}
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();

    const pricelistId = Number.parseInt(params.idd);
    const [price, setPrice] = useState<IPricesResponse>({
        pricelistId: 1,
        effectiveDate:"",
        updateOn: "",
        updateBy: "",
    });
    
    
    useEffect(() => {
        fetchPrice();
    }, []);
    
    const targetDate = new Date(
        parseInt(price.effectiveDate.split("/")[2]), // Năm
        parseInt(price.effectiveDate.split("/")[1]) - 1, // Tháng (lưu ý tháng bắt đầu từ 0)
        parseInt(price.effectiveDate.split("/")[0]) // Ngày
    );

    const checkDate = targetDate > new Date();

    async function fetchPrice() {
        try {
            showLoading();
            const {data: priceRes} = await getPriceDetails(pricelistId);
            setPrice(priceRes);
        
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    async function removeThisPrice() {
        try {
            showLoading();
            await removePrice(pricelistId);
            router.push("./")
            notify("Remove price successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove price failed!", "error");
        }
        finally {
            hideLoading();
        }
    }



    const removePricePopup = 
        <Popup text="This price will be REMOVE, you're sure?">
            <Button
                text="Remove"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    removeThisPrice();
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
                    {
                        checkDate &&
                        <>
                            <Button
                                text="Edit"
                                color={Color.WHITE}
                                bgColor={Color.ORANGE} 
                                actionHandler={() => router.push(`${pricelistId}/edit`)}
                            />
                            <Button
                                text="Remove"
                                color={Color.WHITE}
                                bgColor={Color.RED} 
                                actionHandler={() => {
                                    popup.show(removePricePopup);
                                }}
                            />
                        </>
                    }
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection
                        price={price}
                    />
                    <HomesSection pricelistId={pricelistId} checkDate={checkDate} />
                </div>
            </Main>
        </section>
    )
}

function InfoSection ({
    price,
}: {
    price : IPricesResponse,
}){

    const inforBars: {label: string, key: "pricelistId" | "effectiveDate" | "updateOn"  | "updateBy", icon: string}[] = [
        // {label: "Id", key: "pricelistId", icon: "hashtag"},
        {label: "Effective Date", key: "effectiveDate", icon: "signature"},
        {label: "Update On", key: "updateOn", icon: "pen-to-square"},
        // {label: "Status", key: "status", icon: "map-location-dot"},
        {label: "Update By", key: "updateBy", icon: "person"},
    ];

    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLUE}
            />
            <div className="relative w-full h-44">
                <Image
                    className="object-contain"
                    src="/images/prices.png"
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        label={infoBar.label}
                        value={price?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}

function HomesSection({
    pricelistId,
    checkDate,
}: {
    pricelistId:number,
    checkDate:boolean,
}) {

    const [homesDataset, setHomesDataset] = useState<ICheckBox[]>([]);
    const [selected, setSelected] = useState([]);
    const [homestays, setHomestays] = useState<IHomesPricesResponse[]>([]);
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [homestayId, setHomestayId] = useState(0);
    const popup = usePopup();
    const notify = useNotification();
    const router = useRouter();
    const [price, setPrice] = useState(
        {label: "Price", value: "", icon: "circle-dollar-to-slot", isRequired: true, errorText: ""}
    );

    useEffect(() => {
        fetchHomestays();
    }, []); 

    async function removeThisHomcestay() {
        try {
            showLoading();
            
            const {data : old} = await removeHomestayOutOf(pricelistId,homestayId);
            // router.push("./")
            setHomestays(homestays.filter(t => t.homestayId != old.homestayId ));
            
            notify("Remove homestay out of this price list successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove homestay out of this price list failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    async function addThisHomestay() {
        try {
            showLoading();
            console.log(selected);
            // const {data : newT} =  await addHomestayInOf(pricelistId, homestayId , Number.parseFloat(price.value) );
            // // router.push("/")
            // homestays.push(newT);
            // const newDropdodwn = homesDataset.filter(dd => dd.value != homestayId)
            // setHomesDataset(newDropdodwn);
            // newDropdodwn?.[0] && setHomestayId(Number.parseInt(newDropdodwn[0].value + ""));
            if (selected.length !== 0){
                // const arr = (selected as {value: number}[]);
                const idArray = selected.map((item) => (item as {value:number}).value);
                const {data : newT} =  await addHomestayInOf(pricelistId, idArray , Number.parseFloat(price.value) );
                // router.push("/")
                homestays.push(...newT);
                const arrNew = homesDataset.filter((dd) => {
                    const check = (selected as {value:number}[]).find(s => s.value == dd.value)
                    return !check;
                });
                
                setHomesDataset(arrNew);
                setSelected([]);
                price.value = "";
                // newDropdodwn?.[0] && setHomestayId(Number.parseInt(newDropdodwn[0].value + ""));
    
                notify("Add homestay into this price list successfully!", "success");
            }else {
                notify("No Processing!", "error");
            }
           
        }
        catch (error) {
            if (axios.isAxiosError(error)){
                notify(error.response?.data, "error");
            }
        }
        finally {
            hideLoading();
        }
    }

    async function fetchHomestays() {
        try {
            showLoading();
            const {data: homestaysRes} = await getHomesInOfPrice(pricelistId);
            setHomestays(homestaysRes);
            let {data: homestayCombobox} = await getHomesCombobox(pricelistId);
            homestayCombobox.filter(dd => !homestaysRes.includes(dd));
            setHomesDataset(homestayCombobox.map(homestay => ({
                label: homestay?.name ?? "", value: homestay?.homestayId ?? 0
            })));
            // setSelected(homestayCombobox.map(homestay => ({
            //     label: homestay?.name ?? "", value: homestay?.homestayId ?? 0
            // })));
            // setHomestayId(homestayCombobox[0].homestayId);
            setSelected([]);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const removeTouristPopup = 
        <Popup text="This homestay will be remove out of price list, you're sure?">
            <Button
                text="Remove"
                color={Color.WHITE}
                bgColor={Color.RED} 
                actionHandler={() => {
                    popup.hide();
                    removeThisHomcestay();
                }}
            />
            <Button
                text="Cancel"
                color={Color.BLACK}
                bgColor={Color.WHITE} 
                actionHandler={() => {popup.hide()}}
            />
        </Popup>;

    const deleteBtn = 
        <button className="w-10 h-10 text-white bg-red-600 rounded-md hover:bg-opacity-80">
            <Icon
                name="trash"
                size="lg"
            />
        </button>

    return (
        <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
            <Title text="Homestays belong to this price list" icon="warehouse" color={Color.GREEN} />
                <div className="flex gap-4">
                    {
                        checkDate && 
                       <>
                            {/* <DropDown
                                label="homestays"
                                dataset={homesDataset}
                                handleChange={e => setHomestayId(Number.parseInt(e.target.value))}
                                icon="user"
                                value={homestayId}
                            /> */}
                            <div>
                            <div className="w-80">
                                <MultiSelect
                                    options={homesDataset}
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="Select"
                                />
                            </div>
                            </div>
                            <EditText
                                icon={price.icon}
                                label={price.label}
                                value={price.value}
                                handleChange={(e) => {
                                    setPrice({
                                            ...price,
                                            value: e.target.value,
                                        });
                                    }}
                                errorText={price.errorText}
                                key={price.label + price.errorText}
                            />
                            <Button
                                text="Add"
                                color={Color.WHITE}
                                bgColor={Color.GREEN} 
                                actionHandler={() => {
                                    addThisHomestay();
                                }}
                            />
                       </>
                    }       
                </div>
            <Table
                columns={[
                    // {id: 1, text: "Id", key: "homestayId"},
                    {id: 2, text: "Name", key: "name"},
                    {id: 3, text: "numPeople", key: "numPeople"},
                    {id: 4, text: "price", key: "price"},
                    {id: 5, text: "status", key: "status"},
                ]}
                dataSet={homestays}
                extra={{
                    column: {id: 3, text: "Functions"},
                    node: deleteBtn,
                    handleClick: (id: number) => {
                        checkDate &&
                        popup.show(
                            <Popup text="This homestay will be remove out of price list, you're sure?">
                            <Button
                                text="Remove"
                                color={Color.WHITE}
                                bgColor={Color.RED} 
                                actionHandler={async () => {
                                    popup.hide();
                                    try {
                                        showLoading();
                                        const {data : old} = await removeHomestayOutOf(pricelistId,id);
                                        // router.push("./")
                                        notify("Remove homestay out of this price list successfully!", "success");
                                        setHomestays(homestays.filter(t => t.homestayId != id));
                                        setHomesDataset([
                                            ...homesDataset,
                                            {
                                                label: old.name ?? "",
                                                value: old.homestayId + "" ,
                                            }
                                        ]); 
                                    }
                                    catch (error) {
                                        if (axios.isAxiosError(error)){
                                            notify(error.response?.data, "error");
                                        }
                                    }
                                    finally {
                                        hideLoading();
                                    }
                                }}
                            />
                            <Button
                                text="Cancel"
                                color={Color.BLACK}
                                bgColor={Color.WHITE} 
                                actionHandler={() => {popup.hide()}}
                            />
                        </Popup>
                        )
                    },
                    key: "homestayId"
                }}
            />
        </section>
    )
}

