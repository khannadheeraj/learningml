import axios from "axios"
import { ApiRoutes } from "../Apis/apis";

/* Admin Login */
export const adminUserLogin = async (data) => {
    try {
        const result = await axios.post(ApiRoutes.Auth.AdminUserLogin, data);
        if (result.data.error) {
            return null;
        }
        return result.data;
    } catch (error) {
        console.log(error)
        return error.response?.data;
    }
}