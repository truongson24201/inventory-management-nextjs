import axios from "axios";

// axios.defaults.baseURL = "localhost:5250";
const instance = axios.create({
    baseURL: "http://localhost:8080/api"
});
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers.put['Content-Type'] = 'application/json';

instance.interceptors.request.use(config => {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    return config;
});

export default instance;