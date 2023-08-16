import { IDistrictResponse, IProvinceResponse, IWardResponse } from "./address";
import axios from "./axios.config";
import { ITouristResponse } from "./tourist";

const apiPrefix = "/branches";


export interface IBranchResponse {
    branchId: number,
    name?: string,
    mapLocation?: string,
    status:boolean,
    province:IProvinceResponse,
    district:IDistrictResponse,
    ward:IWardResponse,
}


export const getBranchDetails = (id:number) =>{
    return axios.get<IBranchResponse>(`${apiPrefix}/${id}`)
}

export const getAllBranches = () => {
    return axios.get<IBranchResponse[]>(apiPrefix);
}

export const getTourstsOf = (id:number) =>{
    return axios.get<ITouristResponse[]>(`${apiPrefix}/${id}/tourists`)
}

export const getTourstsCombobox = (id:number) =>{
    return axios.get<ITouristResponse[]>(`${apiPrefix}/${id}/combobox`)
}

export const createBranch = (branchBody:any) => {
    return axios.post(apiPrefix,branchBody)
}

export const updateBracnh = (id:number ,data: {name:string,mapLocation:string,provinceId:number,districtId:number,wardId:number,status:boolean}) => {
    
    return axios.put(`${apiPrefix}/${id}`, data);
}

export const removeBranch = (id: number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}

export const deleteTouristOutOf = (id: number,touristId:number) => {
    return axios.post<ITouristResponse>(`${apiPrefix}/${id}/tourists/${touristId}`);
}

export const addTouristInOf = (id: number,touristId:number) => {
    return axios.post<ITouristResponse>(`${apiPrefix}/${id}/tourists`, touristId);
}
