import axios from "axios";
 
const apiPrefix = "http://localhost:8080/api/accounts";
 
export const login = async (username: string, password: string) => {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    
    return axios.post<ILogin>(`${apiPrefix}/login`, form, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export interface ILogin{
    username:string,
    accessToken:string,
    role:string
}

export const registerAccount = (username:string, password:string,fullName:string,email:string,phone:string) =>{
    return axios.post(`${apiPrefix}/regis/customer`,{username,password,fullName,email,phone});
}