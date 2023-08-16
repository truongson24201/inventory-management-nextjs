import axios from "./axios.config";
import { IBranchResponse } from "./branch";

const apiPrefix = "/tourists";


export interface ITouristResponse {
    touristId: number,
    name?: string,
}

export interface IBranchesTourist {
    branchId: number,
    name?: string,
    address?: string,
    status:string,
}

export const getTourists = () =>{
    return axios.get<ITouristResponse[]>(apiPrefix)
}

export const getTouristDetails = (id:number) =>{
    return axios.get<ITouristResponse>(`${apiPrefix}/${id}`)
}

export const getBranchesOf = (id:number) =>{
    return axios.get<IBranchesTourist[]>(`${apiPrefix}/${id}/branches`)
}

export const createTourist = (name:string) =>{
    return axios.post<ITouristResponse>(`${apiPrefix}` , name)
}

export const updateTourist = (id:number,name:string) =>{
    return axios.put<ITouristResponse>(`${apiPrefix}/${id}` , name)
}


export const removeTourist = (id:number) =>{
    return axios.delete<ITouristResponse>(`${apiPrefix}/${id}`)
}