import axios from "./axios.config";

const apiPrefix = "/accounts";

export interface IAccountResponse {
    accountId: number,
    username:string,
    fullName?:string,
    email:string,
    phoneNumber?:string
    status: boolean,
    roleId: number,
    branchId?: number,
}

export interface IRoleResponse {
    id?: number,
    name?: string,
}

export const getAllAccounts = (roleId?: number) => {
    return axios.get(apiPrefix, {
        params: {
            roleId,
        }
    });
}

export const getAccountDetails = (id: number) => {
    return axios.get<IAccountResponse>(`${apiPrefix}/${id}`);
}

export const createAccount = (username: string, fullName: string, email:string,phoneNumber:string,roleId:number) =>{
    return axios.post(apiPrefix, {
        username,
        fullName,
        email,
        phoneNumber,
        roleId,
    });
}

export const updateAccount = (id: number,data : {fullName: string, email:string,phoneNumber:string,status:boolean,roleId:number,branchId:number}) =>{
    return axios.put(`${apiPrefix}/${id}`, data);
}

export const removeAccount = (id: number) =>{
    return axios.delete(`${apiPrefix}/${id}`);
}
