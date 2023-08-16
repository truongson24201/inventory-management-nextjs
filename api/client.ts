import axios from "./axios.config";

const apiPrefix = "/clients/invoices";

export interface IInvoices {
    invoiceId:number,
    homestayId:number,
    name:string,
    address:string,
    numPeople:number,
    checkIn:string,
    checkOut:string,
    updateOn:string,
    total:number,
    fullName:string,
    email:string,
    phoneNumber:string,
    status:string,
}

export const getInvoiceForm = (id:number, checkIn:string, checkOut:string) =>{
    return axios.post<IInvoices>(`${apiPrefix}/${id}/form`, {checkIn,checkOut});
}

export const createInvoice = (homestayId:number, fullName:string, email:string, phoneNumber:string, checkIn:string, checkOut:string) => {
    return axios.post<IInvoices>(`${apiPrefix}/${homestayId}`,{fullName,email,phoneNumber,checkIn,checkOut});
}

export const getAllInvoicesClient = () => {
    return axios.get<IInvoices[]>(apiPrefix);
}

export const getInvoiceClientDetails = (invoiceId:number) =>{
    return axios.get<IInvoices>(`${apiPrefix}/${invoiceId}`);
}

export const cancelInvoice =(id:number) =>{
    return axios.delete<IInvoices>(`${apiPrefix}/${id}`); 
}

export const updateInfoInvoice = (id:number, fullName:string, email:string, phoneNumber:string) => {
    return axios.put<IInvoices>(`${apiPrefix}/${id}`,{fullName,email,phoneNumber});
}


export const createPaymentPaypal = (price:number, orderId:number) =>{
    return axios.post(`${apiPrefix}/pay` , {
        price,
        "currency": "USD",
        "method": "paypal",
        "intent": "sale",
        "description": orderId,
    });
}

export const getResultPayment = (paymentId:string, payerID:string) =>{
    return axios.get(`${apiPrefix}/pay/success`, {
        params: {paymentId,payerID}
    });
}

export const updatePaymentStatus = (id:number) =>{
    return axios.put(`${apiPrefix}/${id}/payment`);
}


// const UpdatePaymentStatus=async(orderId)=>{
//     const response = await axios.post(CLIENT_URL +"/payment/success",{
//         order_id: orderId
//     },{
//         headers: authHeader()
//     })
//     return response
// }