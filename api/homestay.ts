import axios from "./axios.config";
import { IFacilityResponse } from "./facility";
import { IHomesPricesResponse } from "./price";

const apiPrefix = "/homestays";

export interface IHomestayResponse {
    homestayId : number,
    name: string,
    numPeople:number,
    status:string,
    updateOn: string,
    updateBy:string,
}

export interface IImagesResponse {
    imageId : number,
    url: string,
}

export const getHomestayDetails = (id:number) =>{
    return axios.get<IHomestayResponse>(`${apiPrefix}/${id}`)
}

export const getAllHomestay = (branchId:number,date:string) => {
    return axios.get(apiPrefix,{
        params:{"id":branchId,date}
    });
}

export const getStatus = () =>{
    return axios.get<string[]>(`${apiPrefix}/status`);
}

export const createHomestay = (id:number,name:string,numPeople:number) => {
    return axios.post(`${apiPrefix}/${id}`,{name,numPeople})
}

export const updateHomestay = (id:number,name:string, numPeople:number,status:string) =>{
    return axios.put(`${apiPrefix}/${id}`,{name,numPeople,status})
}

export const removeHomestay = (id:number) => {
    return axios.delete(`${apiPrefix}/${id}`)
}

export const getImages = (homestayId:number) => {
    return axios.get<IImagesResponse[]>(`${apiPrefix}/${homestayId}/images`,{
        params:{"id":homestayId}
    });
}

export const getFacilitiesOfHome = (homestayId: number) => {
    return axios.get<IFacilityResponse[]>(`${apiPrefix}/${homestayId}/facilities`,{
        params:{"id":homestayId}
    });
}

export const getFacilitiesCombobox = (id: number) => {
    return axios.get<IFacilityResponse[]>(`${apiPrefix}/${id}/combobox`);
}


export const setImagesInOf = (id:number, imageList:FileList | null | undefined) => {
    const images = new FormData();
    if (imageList) {
        for (let i = 0; i < imageList?.length; i++) {
            images.append(`images`, imageList[i])
        }
    }
    return axios.post<IImagesResponse[]>(`${apiPrefix}/images?id=${id}`,images, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const removeImageOutOf = (id:number, imageId:number)  => {
    return axios.delete(`${apiPrefix}/${id}/images/${imageId}`);
}

export const setFacilitityInOf = (id:number,facilityId:number) => {
    return axios.post<IFacilityResponse>(`${apiPrefix}/${id}/facilities`,facilityId);
}

export const removeFacilityOutOf =(id:number,facilityId:number) => {
    return axios.put(`${apiPrefix}/${id}/facilities/${facilityId}`);
}

export const getPricesOfHome =(id:number) => {
    return axios.get<IHomesPricesResponse[]>(`${apiPrefix}/${id}/prices`);
 }
 
 export const refreshPrices = (id:number) => {
    return axios.put(`${apiPrefix}/${id}/prices/refresh`);
 }

 export const getHomestayEmpty = (id:number,checkIn:string) => {
    // const checkIn = new Date(checkInn);
    // // checkIn.setDate(checkIn.getMonth());
    // console.log(checkIn)
    return axios.get(`${apiPrefix}/empty`,{
        params:{id,checkIn}
    });
 }

