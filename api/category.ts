import axios from "./axios.config";

const apiPrefix = "/categories";

export interface CategoryResponse {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
}

export const GetAllCategories = () => {
    return axios.get(apiPrefix);
}

export const getCategoryById = (id: number) => {
    return axios.get(`${apiPrefix}/${id}`);
};