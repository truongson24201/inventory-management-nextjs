'use client';
import { IInvoicesResponse, getCardDropDown, getInvoiceDetails, getStatusDropDown, updateInvoice } from "@/api/invoice";
import BackwardButton from "@/components/BackwardButton";
import Title from "@/components/DashboardTitle";
import DropDown, { IDropdownData } from "@/components/DropDown";
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
import axios, { AxiosError } from "axios";
import { Console } from "console";
import { Erica_One } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getHomestayEmpty } from "@/api/homestay";


export default function Page({
    params
}: {
    params: {id: string}
}) {

    const [showLoading, hideLoading] = useLoadingAnimation();
    const [invoice, setInvoice] = useState<IInvoicesResponse>({
        invoiceId:0,
        create:"",
        checkIn:"",
        checkOut:"",
        total:0,
        fullName:"",
        email:"",
        identityNumber:"",
        cardType:"",
        phoneNumber:"",
        status:"",
        updateOn:"",
        updateBy:"",
        homestayId:0,
        name:"",
    });

    const [field, setField] = useState(
        {label: "Identity Number", value: "", icon: "signature", isRequired: true, errorText: ""}
    );

    const [statusDataset, setStatusDataset] = useState<IDropdownData[]>([]);
    const [status, setStatus] = useState("");
    const [cradDataset, setCardDataset] = useState<IDropdownData[]>([]);
    const [card, setCard] = useState("");
    const [homestaysDataset, setHomestaysDateset] = useState<IDropdownData[]>([]);
    const [homestayId,setHomestayId] = useState(0);


    
    // const [touristId, setTouristId] = useState(0);
    const invoiceId = Number.parseInt(params.id);
    const router = useRouter();
    const popup = usePopup();
    const notify = useNotification();
    const notifyPopup = useNotification();

    useEffect(() => {
        fetchInvoice();
        fetchStatus();
    }, []);

    // useEffect(() =>{
    //     fetchHomestayEmpty();
    // },[homestayId])

    async function fetchInvoice() {
        try {
            showLoading();
            const {data: invoiceRes} = await getInvoiceDetails(invoiceId);
            setInvoice(invoiceRes);
            setHomestayId(invoiceRes.homestayId);
            const {data:hRes} = await getHomestayEmpty(invoiceRes.invoiceId,invoiceRes.checkIn);
            hRes.push({homestayId:invoiceRes.homestayId,name:invoiceRes.name+"(current)"})
            setHomestaysDateset(hRes.map((item: { name: any; homestayId: any; }) => ({
                text: item.name,
                value: item.homestayId,
            })));
            setStatus(invoiceRes.status);
            setCard(invoiceRes.cardType);
            setField({
                ...field,
                value: invoiceRes.identityNumber,
            });
        }
        catch (error) {
            console.log(error); 
        }
        finally {
            hideLoading();
        }
    }


    const fetchStatus = async () => {
        try {
            showLoading();
            const {data} = await getStatusDropDown();
            const {data:cradRes} = await getCardDropDown();
            
            setStatusDataset(data.map(item => ({
                text: item,
                value: item,
            })));
            
            setCardDataset(cradRes.map(item => ({
                text: item,
                value: item,
            })));
            
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    const updateThisInvoice = async () => {
        try {
            showLoading();
            // await upda
            const {data} = await updateInvoice(invoiceId,homestayId,field.value,status,card);
            // router.push("./");
            setInvoice(data);
            setHomestayId(data.homestayId);
            const {data:hRes} = await getHomestayEmpty(data.invoiceId,data.checkIn);
            hRes.push({homestayId:data.homestayId,name:data.name+"(current)"})
            setHomestaysDateset(hRes.map((item: { name: any; homestayId: any; }) => ({
                text: item.name,
                value: item.homestayId,
            })));
            // console.log(data);
            notify("Edit successfully!", "success");
        }catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)){
                notify(error.response?.data, "error");
            }
            // notifyPopup("Update account failed!","error");
        }
        finally {
            hideLoading();
        }
    }

    async function handleExportPDF() {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
        const fontSize = 12;
        const lineHeight = fontSize * 1.2;
        const textX = 50;
        let textY = page.getHeight() - 50;
    
        const drawText = (text:any) => {
          page.drawText(text, { x: textX, y: textY, size: fontSize });
          textY -= lineHeight;
        };
    
        drawText(`Invoice ID: ${invoice.invoiceId}`);
        // drawText(`Check-in: ${invoice.name}`);
        drawText(`Create: ${invoice.create}`);
        drawText(`Check-in: ${invoice.checkIn}`);
        drawText(`Check-Out: ${invoice.checkOut}`);
        drawText(`Fullname: ${invoice.fullName}`);
        drawText(`Email: ${invoice.email}`);
        drawText(`Phone number: ${invoice.phoneNumber}`);
        drawText(`Total: ${invoice.total}`);
        drawText(`Update By: ${invoice.updateBy}`);
        drawText(`Update On: ${invoice.updateOn}`);
        drawText(`Status: ${invoice.status}`);

        // ... Draw other fields
    
        const pdfBytes = await pdfDoc.save();
    
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        // a.download = 'invoice.pdf';
        a.click();
    
        URL.revokeObjectURL(url);
      }


    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <BackwardButton />
                    <Button
                        text="PDF"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={handleExportPDF}
                    />
                    {/* <Button
                        text="Remove"
                        color={Color.WHITE}
                        bgColor={Color.RED} 
                        actionHandler={() => {
                            popup.show(removeBranchPopup);
                        }}
                    /> */}
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <InfoSection 
                        invoice={invoice}
                    />
                    <section className="w-3/5 p-3 pt-6 h-full flex flex-col border-2 rounded-r-sm gap-6">
                        <Title text="Edit Invoice" icon="warehouse" color={Color.GREEN} />
                        <div className="mt-10 mx-auto w-[480px] flex flex-col gap-4">
                            <EditText
                                icon={field.icon}
                                label={field.label}
                                value={field.value}
                                handleChange={(e) => {
                                    setField({
                                            ...field,
                                            value: e.target.value,
                                        });
                                    }}
                                errorText={field.errorText}
                                key={field.label + field.errorText}
                                disabled={invoice.status && (invoice.status === "CANCEL" || invoice.status === "CHECKOUT") ? true : false}
                            />
                            <DropDown
                                label="Homestay"
                                dataset={homestaysDataset}
                                handleChange={e => setHomestayId(Number.parseInt(e.target.value))}
                                icon="hotel"
                                value={homestayId}
                                disabled={invoice.status && (invoice.status === "CANCEL" || invoice.status === "CHECKOUT") ? true : false}
                            />
                            <DropDown
                                label="Status"
                                dataset={statusDataset}
                                handleChange={e => setStatus(e.target.value)}
                                icon="circle-info"
                                value={status}
                                disabled={invoice.status && (invoice.status === "CANCEL" || invoice.status === "CHECKOUT") ? true : false}
                            />
                            <DropDown
                                label="Card"
                                dataset={cradDataset}
                                handleChange={e => setCard(e.target.value)}
                                icon="address-card"
                                value={card}
                                disabled={invoice.status && (invoice.status === "CANCEL" || invoice.status === "CHECKOUT") ? true : false}
                            />
                            <Button
                                text="UPDATE"
                                color={Color.WHITE}
                                bgColor={Color.GREEN} 
                                actionHandler={updateThisInvoice}
                            />
                        </div>
                    </section>
                </div>
            </Main>
        </section>
    )
}

function InfoSection({
    invoice,
}: {
    invoice: IInvoicesResponse,
}) {
    const inforBars: {label: string, key: "create" | "checkIn"  | "checkOut" | "total" | "fullName" | "email" |
    "identityNumber" | "cardType" | "phoneNumber" | "status" | "updateOn" | "updateBy" | "name", icon: string}[] = [
        {label: "Room", key: "name", icon: "house-user"},
        {label: "Create", key: "create", icon: "signature"},
        {label: "CheckIn", key: "checkIn", icon: "calendar-check"},
        {label: "CheckOut", key: "checkOut", icon: "angles-left"},
        {label: "Total", key: "total", icon: "circle-dollar-to-slot"},
        {label: "Full Name", key: "fullName", icon: "address-card"},
        {label: "Email", key: "email", icon: "at"},
        {label: "Identity Number", key: "identityNumber", icon: "signature"},
        {label: "Card Type", key: "cardType", icon: "credit-card"},
        {label: "Phone", key: "phoneNumber", icon: "phone"},
        {label: "Status", key: "status", icon: "circle-info"},
        {label: "Update On", key: "updateOn", icon: "pen-to-square"},
        {label: "Update By", key: "updateBy", icon: "person"},
        
    ];

    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLACK}
            />
            <div className="relative w-full h-44">
                <Image
                    className="object-contain"
                    src="/images/invoice1.png"
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
            {inforBars.map(infoBar =>
                <InfoBar
                    key={infoBar.key}
                    label={infoBar.label}
                    value={invoice?.[infoBar.key] ?? ""}
                    icon={infoBar.icon}
                />
            )}
            </div>
        </section>
    )
}
