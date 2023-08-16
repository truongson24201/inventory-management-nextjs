import axios from "axios";
 
const apiPrefix = "http://localhost:8080/api/auth";
 
export const login = async (username: string, password: string) => {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    
    return axios.post(`${apiPrefix}/login`, form, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}