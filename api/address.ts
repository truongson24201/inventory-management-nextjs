import axios from "./axios.config";

const apiPrefix = "/address";

export interface IProvinceResponse {
    provinceId: number,
    name?:string,
}

export interface IDistrictResponse {
    districtId: number,
    name?:string,
}


export interface IWardResponse {
    wardId: number,
    name?:string,
}


export const getProvinces = () => {
    return axios.get<IProvinceResponse[]>(`${apiPrefix}/provinces`);
}

export const getDistrits = (id?: number) => {
    return axios.get<IDistrictResponse[]>(`${apiPrefix}/districts`,{
        params: {
            id,
        }
    });
}

export const getWards = (id?: number) => {
    return axios.get<IWardResponse[]>(`${apiPrefix}/wards`,{
        params: {
            id,
        }
    });
}

export const getProvinceDetails = (id: number) => {
    return axios.get(`${apiPrefix}/provinces/${id}`);
}

export const getDistritDetails = (id: number) => {
    return axios.get(`${apiPrefix}/districts/${id}`);
}

export const getWardDetails = (id: number) => {
    return axios.get(`${apiPrefix}/wards/${id}`);
}