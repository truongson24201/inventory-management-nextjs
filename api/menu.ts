import axios from "./axios.config";
import { IMenuItemCategoryView, IPriceMenuItemView } from "./response";

const apiPrefix = "/public";
const apiPrefix1 = "/menu-items";
const apiPrefix2 = "/menu-item-categories";

export const getAllNow = () => {
    return axios.get<IPriceMenuItemView[]>(`${apiPrefix}/menu-items`);
}

export const getAllNow1 = () => {
    return axios.get<IPriceMenuItemView[]>(`${apiPrefix}/menu-items-all`);
}

export const getMenuDetail = (id: number) => {
    return axios.get<IPriceMenuItemView>(`${apiPrefix}/menu-items/detail`, {
        params: { id }
    });
}

export interface CUMenuItemReq {
    menuItemId: number,
    menuItemName: string,
    menuItemCategoryId: number,
    menuItemGroup: string,
    description: string,
    isActive: boolean,
}

export const createMenuItem = (image: File, data: CUMenuItemReq) => {
    const formData = new FormData();

    // Thêm file ảnh vào formData
    formData.append('image', new Blob([image], { type: 'application/octet-stream' }),image.name);

    // Thêm object JSON đã stringify vào formData
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    return axios.post<IPriceMenuItemView>(`${apiPrefix1}/create`, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
}

export const getAllCategory = () => {
    return axios.get<IMenuItemCategoryView[]>(`${apiPrefix2}`);
}

