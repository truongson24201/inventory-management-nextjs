import axios from "./axios.config";

const apiPrefix = "/warehouseProducts";

export interface warehouseProductResponse {
    warehouseId: number,
    productId: number,
    quantity: number,
}

export const getAllWhsProducts = () => {
    return axios.get(apiPrefix);
}

export const getWhsProductsByWarehouse = (warehouseId: number) => {
    return axios.get(`${apiPrefix}`, {
        params: {
            warehouseId: warehouseId
        }
    });
}