import axios from "./axios.config";
import { IOrderView, IReservationView, ITableHistoryView } from "./response";

const apiPrefix = "/table-histories";

export interface CUTableHistoryReq {
    tableHistoryId: number,
    adultsQuantity: number,
    childrenQuantity: number,
    status: string,
}


export const getHistoryDetail = (id:number) =>{
    return axios.get<ITableHistoryView>(`${apiPrefix}/detail`,{
        params: {id}
    })
}

export const updateTableHistory = (data:CUTableHistoryReq) =>{
    return axios.put<ITableHistoryView>(`${apiPrefix}/update`,data)
}

export const getOrders = (id:number) =>{
    return axios.get<IOrderView[]>(`${apiPrefix}/order`,{
        params: {id}
    })
}

export interface UMenuTableHistoryReq{
    tableHistoryId:number,
    menuItemQuantity:number,
    priceMenuItemId:number
}

export const updateOrder = (data:UMenuTableHistoryReq) =>{
    return axios.put<IOrderView>(`${apiPrefix}/order`,data)
}

export const deleteMenuInTableHistory = (tableHistoryId:number,priceMenuItemId:number) =>{
    return axios.delete(`${apiPrefix}/order/by-id`,{
        params:{
            tableHistoryId,
            priceMenuItemId
        }
    })
}

export const callApiToCalculateTotal = (id:number) =>{
    return axios.get(`${apiPrefix}/total`,{
        params:{
            id,
        }
    })
}