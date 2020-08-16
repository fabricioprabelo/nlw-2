import axios from "axios";

const apiService = axios.create({
    baseURL: "http://192.168.0.106:3333"
});

export default apiService;