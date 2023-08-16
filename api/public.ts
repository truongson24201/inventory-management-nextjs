import axios from "./axios.config";

const apiPrefix = "/public";
const apiSignup = "/auth";



export interface IBranchesPublic {
    branchId: number,
    name: string,
    address:string,
    status:string,
}

export interface IHomestays {
    homestayId:number,
    name:string,
    numPeople:number,
    price:number,
    images:string,
}

export interface IHomesPublic {
    branchId:number,
    address:string,
    homestayId:number,
    name:string,
    numPeople:number,
    price:number,
    image:string,
}

export interface IHomestayDetails {
    homestayId:number,
    name:string,
    numPeople:number,
    price:number,
        images:{
            id:number,
            url:string,
        }[],
    facilities:{
        id:number,
        name:string,
    }[],
    tourists:{
        id:number,
        name:string,
    }[],
}

export interface IAccount {
    username:string,
    password:string,
    fullName:string,
    email:string,
    phoneNumber:string,
}

export interface IEvaluation {
    username:string,
    create:string,
    point:number,
    content:string,
}

export interface IHomesCanlendar {
    name:string,
    address:string,
    date:string,
    type:boolean,
}

export const getBranchesAddress = (address:string)  =>{
    return axios.post<IBranchesPublic[]>(`${apiPrefix}/search`, address);
}

export const getHomestaysClient = (branchId:number, checkIn: string, checkOut:string, numPeople:number) => {
    // const checkIn = new Date(checkInn);
    // const checkOut = new Date(checkOutt);
    console.log(checkIn,checkOut);
    return axios.get<IHomestays[]>(`${apiPrefix}/${branchId}`,{
        params:{checkIn,checkOut,numPeople}
    }); 
}

export const getHomestayDetailsClient = (id:number) =>{
    return axios.get<IHomestayDetails>(`${apiPrefix}/${id}/details`);
}

export const registerAccount = (username:string, password:string,fullName:string,email:string,phoneNumber:string) =>{
    return axios.post(`${apiSignup}/register`,{username,password,fullName,email,phoneNumber});
}

export const getHomesPublic = () =>{
    return axios.get<IHomesPublic[]>(`${apiPrefix}/homestays`);
}

export const getEvaluation = (id:number) =>{
    return axios.get<IEvaluation[]>(`${apiPrefix}/homestay/${id}/evaluation`);
}

export const sendEvaluation = (id:number,point:number,content:string) =>{
    return axios.post<IEvaluation>(`${apiPrefix}/homestay/${id}`,{point,content});
}

export const getHomesCalendar = (year:number, month:number) =>{
    return axios.get<IHomesCanlendar[]>(`${apiPrefix}/calendar`,{
        params: {year,month}
    });
}