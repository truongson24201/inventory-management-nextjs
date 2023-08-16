'use client';
import { IInvoicesResponse, getAllInvoices, getStatusDropDown, refreshInvoices } from "@/api/invoice";
import ComboBox from "@/components/Combobox";
import Title from "@/components/DashboardTitle";
import DropDown, { IDropdownData } from "@/components/DropDown";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [invoices, setInvoices] = useState<IInvoicesResponse[]>([]);
    const [statusDataset, setStatusDataset] = useState<IDropdownData[]>([]);
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [invoiceId, setInvoiceId] = useState(0);
    const [filterInvoices, setFilterInvocies] = useState<IItem[]>([]);
    const notify = useNotification();  
    const [status, setStatus] = useState("");
    const [date,setDate] = useState("");


    useEffect(() => {
        fetchStatus();
    }, []);

    useEffect(() => {
        if (status !== ""){
            fetchInvoices();
        }
    }, [status,date])

    const fetchStatus = async () => {
        try {
            showLoading();
            const {data} = await getStatusDropDown();
            setStatusDataset(data.map(item => ({
                text: item,
                value: item,
            })));
            setStatus(data[0]);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const fetchInvoices = async () => {
        try {
            showLoading();
            const {data:invoicesRes} = await getAllInvoices(status,date);
            setInvoices(invoicesRes);
            setSearchValue("");
            setFilterInvocies(invoicesRes);
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

    async function refreshThisInvoices() {
        try {
            showLoading();
            const {data} = await refreshInvoices();
            // setInvoices(data);
            // router.push("/");
            notify(data, "success");
            fetchInvoices();
        }
        catch (error) {
            if(axios.isAxiosError(error)){
                notify(error.response?.data, "error")
            }
        }
        finally {
            hideLoading();
        }
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <Title
                    text="Invoices"
                    icon="file-invoice-dollar"
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-10 h-10">
                        <SearchInput
                            placeholder="Type fullname or phone here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(invoices), 
                                        newSearchValue.trim(), 
                                        ["fullName", "phoneNumber"]
                                    );
                                setFilterInvocies(filterList);
                            }}
                        />
                        <DropDown
                            label="Status"
                            dataset={statusDataset}
                            handleChange={e => setStatus(e.target.value)}
                            icon="user"
                            value={status}
                        />
                        <p className="mt-2 font-bold -mr-6">Check In:</p>
                        <input type="date" className=" bg-gray-100 rounded-lg focus:text-cyan-500 lg:hover:text-cyan-500 outline-none" 
                            onChange={(event:any) => {
                                const value = event.target.value;
                                setDate(value);
                            }}
                            value={date}
                        />
                        <div className="ml-auto">
                            <Button 
                                text=""
                                icon="rotate"
                                bgColor={Color.WHITE}
                                actionHandler={async() => {
                                    refreshThisInvoices();
                                }}
                                color={Color.BLACK}
                                size="xl"
                            />  
                        </div>
                    </section>
                    <Table
                        linkRoot="invoices/"
                        keyLink="invoiceId"
                        columns={[
                            // {id: 1, text: "Id", key: "invoiceId", linkRoot: "invoices/"},
                            {id: 2, text: "Room", key: "name"},
                            {id: 5, text: "Full name", key: "fullName"},
                            {id: 3, text: "Phone", key: "phoneNumber"}, 
                            {id: 4, text: "Create", key: "create"},
                            {id: 6, text: "checkIn", key: "checkIn"}, 
                            {id: 7, text: "checkOut", key: "checkOut"}, 
                            {id: 8, text: "status", key: "status"}, 
                        ]}
                        dataSet={filterInvoices}
                    />
                </div>
            </Main>
        </section>
    )
}