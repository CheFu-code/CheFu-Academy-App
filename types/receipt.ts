export type Receipt = {
    id: string;
    status: string;
    payer: {
        name: {
            given_name: string;
            surname: string;
        };
    };
    purchase_units: {
        payments: {
            captures: {
                amount: {
                    value: string;
                    currency_code: string;
                };
            }[];
        };
    }[];
};


export interface SuccessScreenUIProps {
    receipt: {
        id: string;
        status: string;
        planType?: string;
        payer?: {
            name?: {
                given_name?: string;
                surname?: string;
            };
        };
        purchase_units?: {
            payments?: {
                captures?: {
                    amount?: {
                        value?: string;
                        currency_code?: string;
                    };
                }[];
            };
        }[];
    };
    countdown: number;
}
