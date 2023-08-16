import axios from "./axios.config";
import { IHomestayResponse } from "./homestay";

const apiPrefix = "/facilities";


export interface IFacilityResponse {
    facilityId: number,
    name?: string,
}

export const getFacilities = () =>{
    return axios.get<IFacilityResponse[]>(apiPrefix)
}

export const gethomestaysInOf = (id:number) =>{
    return axios.get<IHomestayResponse[]>(`${apiPrefix}/${id}/homestays`)
}

export const getFacilityDetails = (id:number) =>{
    return axios.get<IFacilityResponse>(`${apiPrefix}/${id}`)
}

export const createFacility = (name:string) =>{
    return axios.post<IFacilityResponse>(`${apiPrefix}` , name)
}

export const updateFacility = (id:number, name:string) => {
    return axios.put<IFacilityResponse>(`${apiPrefix}/${id}` , name)
}

export const removeFacility = (id:number) =>{
    return axios.delete<IFacilityResponse>(`${apiPrefix}/${id}`)
}