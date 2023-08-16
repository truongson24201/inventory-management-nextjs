import axios from "./axios.config";

const apiPrefix = "/invoices";

export interface IInvoicesResponse {
    invoiceId:number,
    create:string,
    checkIn:string,
    checkOut:string,
    total:number,
    fullName:string,
    email:string,
    identityNumber:string,
    cardType:string,
    phoneNumber:string,
    status:string,
    updateOn:string,
    updateBy:string,
    homestayId:number,
    name:string,
}

export const getAllInvoices = (status:string,date:string) => {
    return axios.get(`${apiPrefix}`,{
        params: {status,date}
    });
}

export const getInvoiceDetails = (id:number) => {
    return axios.get<IInvoicesResponse>(`${apiPrefix}/${id}`);
}

export const getStatusDropDown = () => {
    return axios.get<string[]>(`${apiPrefix}/combobox-invoice`);
}

export const getCardDropDown = () => {
    return axios.get<string[]>(`${apiPrefix}/combobox-card`);
}

export const updateInvoice = (id:number ,homestayId:number,identityNumber:string,status:string,cardType:string) => {
    return axios.put<IInvoicesResponse>(`${apiPrefix}/${id}`, {homestayId,identityNumber,status,cardType})
}

export const refreshInvoices = () => {
    return axios.put(`${apiPrefix}/refresh`);
}
