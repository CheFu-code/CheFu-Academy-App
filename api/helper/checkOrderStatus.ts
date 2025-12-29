import axios from 'axios';
import { PAYPAL_API } from '../constants/values';

// Check order status before capture
export async function checkOrderStatus(
    orderID: string,
    accessToken: string,
): Promise<string> {
    const response = await axios.get(
        `${PAYPAL_API}/v2/checkout/orders/${orderID}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    console.log('ℹ️ Order details:', JSON.stringify(response.data, null, 2));
    return response.data.status;
}
