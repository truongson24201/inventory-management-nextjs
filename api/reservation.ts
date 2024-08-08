import axios from "./axios.config";
import { IReservationView } from "./response";

const apiPrefix = "/reservations";

export const createReservation = (
    reservationId?:number | null,
    reservationTimeFrameId?: number,
    dateRegis?: string,
    adultsQuantity?:number,
    childrenQuantity?:number,
    note?:string,
    status?:string,
) => {
    return axios.post<IReservationView>(`${apiPrefix}/create`, {
        reservationId,
        reservationTimeFrameId,
        dateRegis,
        adultsQuantity,
        childrenQuantity,
        note,
        status
    })
}

export const updateReservation = (
    reservationId?:number | null,
    reservationTimeFrameId?: number,
    dateRegis?: string,
    adultsQuantity?:number,
    childrenQuantity?:number,
    note?:string,
    status?:string,
) => {
    return axios.put<IReservationView>(`${apiPrefix}/update`, {
        reservationId,
        reservationTimeFrameId,
        dateRegis,
        adultsQuantity,
        childrenQuantity,
        note,
        status
    })
}

export const getReservation = (date:string | null) => {
    return axios.get<IReservationView[]>(`${apiPrefix}/by-date`,{
        params: {date}
    })
}

export const getReservationDetail = (id:number) => {
    return axios.get<IReservationView>(`${apiPrefix}/detail`,{
        params: {id}
    })
}

export const getReservationCheckIn = (phone:string | null,date:string) => {
    return axios.get<IReservationView[]>(`${apiPrefix}/by-check-in`,{
        params: {phone,date}
    })
}

