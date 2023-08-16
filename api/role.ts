import axios from "./axios.config";
// import axios from "axios";

const apiPrefix = "/roles";
// const apiPrefix = "http://localhost:8080/api/management/account";


export interface IRoleResponse {
    id?: number,
    name?: string,
}


export const getRoleDetails = (id: number) => {
    return axios.get<IRoleResponse>(`${apiPrefix}/${id}`);
}

export const getAllRoles = () =>{
    return axios.get<IRoleResponse[]>(apiPrefix);
}

// export const getBranchById = (id: number) => {
//     return axios.get(`${apiPrefix}/${id}`)
// }

// export const createBranch = (name: string = "", address: string = "") => {
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("address", address);

//     return axios.post(`${apiPrefix}`, formData);
// }

// export const updateBranch = (id: number, name: string = "", address: string = "") => {
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("address", address);

//     return axios.put(`${apiPrefix}/${id}`, formData);
// }

// export const deleteBranch = (id: number) => {
//     return axios.delete(`${apiPrefix}/${id}`);
// }
