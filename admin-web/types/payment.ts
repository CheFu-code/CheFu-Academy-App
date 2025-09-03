export type Payment = {
    amount: {
        currency_code: string;
        value: string;
    };
    email: string;
    orderID: string;
    payerID: string;
    payerName: {
        given_name: string;
        surname: string;
    };
    planType: string;
    status: string;
    timestamp: Date;
};