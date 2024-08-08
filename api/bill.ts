import axios from "./axios.config";
import { IReservationView } from "./response";

const apiPrefix = "/bills";

export const getBillsByDate = (date:string | null) => {
    return axios.get<IReservationView[]>(`${apiPrefix}/all-by-date`,{
        params: {date}
    })
}