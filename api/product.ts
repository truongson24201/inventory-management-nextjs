import axios from "./axios.config";

const apiPrefix = "/products";

export interface ProductResponse {
    id: number,
    name: string,
    sku: string,
    categoryId: number,
    dimensions: string,
    weight: string,
    tempPrice: number,
    imageUrl: string,
}

export const getAllProducts = () => {
    return axios.get(apiPrefix);
}

export const getProductById = (id: number) => {
    return axios.get(`${apiPrefix}/${id}`)
}
