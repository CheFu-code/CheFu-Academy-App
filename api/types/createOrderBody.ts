export interface CreateOrderBody {
    amount: string;
    return_url?: string;
    cancel_url?: string;
}