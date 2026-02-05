export interface CustomRequest extends Express.Request {
    user: {
        wallet: {
            address: string;
        };
    };
}

