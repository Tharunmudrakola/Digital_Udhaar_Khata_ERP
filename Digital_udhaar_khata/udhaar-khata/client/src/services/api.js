import axios from "axios";

const API = axios.create({
    baseURL: "https://digital-udhaar-khata-erp.onrender.com/api"
});

export default API;