import axios from "./axios.config";

const apiPrefix = "/warehouses";

export interface WarehouseResponse {
    id: number,
    name: string,
    address: string,
    branchId: number,
}

export const getAllWarehouses = (branchId?: number) => {
    if (branchId)
        return axios.get(apiPrefix, {
            params: {"branch" : branchId}
        });
    return axios.get(apiPrefix);
}

export const getWarehouseById = (id: number) => {
    return axios.get(`${apiPrefix}/${id}`);
}