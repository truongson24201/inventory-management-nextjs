import axios from "./axios.config";

const apiPrefix = "/charts";

export interface INumInvoices {
    amount:number,
    status:string,
}

export interface ITotalBooking {
    invoiceCount:number,
    total:number,
}

export interface ITotalOfYear {
    month:number,
    total:number,
}

export interface IRanks {
    name:string,
    total:number,
}

export const getNewInvoices = () =>{
    return axios.get<INumInvoices>(`${apiPrefix}/invoices/new`);
}

export const getPendingInvoices = () =>{
    return axios.get<INumInvoices>(`${apiPrefix}/invoices/pending`);
}

export const getTotalBooking = (from:string,to:string) => {
    return axios.get<ITotalBooking>(`${apiPrefix}/invoices/total`,{
        params: {from,to}
    });
}

export const getTotalActive = (from:string,to:string) => {
    return axios.get<ITotalBooking>(`${apiPrefix}/invoices/active`,{
        params: {from,to}
    });
}

export const getTotalCancel = (from:string,to:string) => {
    return axios.get<ITotalBooking>(`${apiPrefix}/invoices/cancel`,{
        params: {from,to}
    });
}

export const getRanks = () =>{
    return axios.get<IRanks[]>(`${apiPrefix}/ranks`);
}

export const getTotalOfYear = (year:number) =>{
    return axios.get<ITotalOfYear[]>(`${apiPrefix}/total`,{
        params:{year}
    });
}
