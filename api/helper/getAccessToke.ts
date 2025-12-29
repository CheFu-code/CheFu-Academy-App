import axios, { AxiosRequestConfig } from "axios";
import { CLIENT_ID, CLIENT_SECRET, PAYPAL_API } from "../constants/values";

export async function getAccessToken(): Promise<string> {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error("PayPal credentials are missing!");
    }

    const config: AxiosRequestConfig = {
        method: "post",
        url: `${PAYPAL_API}/v1/oauth2/token`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
            username: CLIENT_ID,
            password: CLIENT_SECRET,
        },
        data: "grant_type=client_credentials",
    };

    const response = await axios(config);

    return response.data.access_token;
}
