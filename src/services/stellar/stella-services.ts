import StellarSdk, {Keypair} from "@stellar/stellar-sdk";

const stellar_horizon_rpc = {
    "testnet": "https://horizon-testnet.stellar.org/",
    "futurenet": "https://horizon-futurenet.stellar.org"
}

export class StellarServices {
    private server: any
    private keypair: any

    constructor(privateKey: string, networ: string = stellar_horizon_rpc.testnet ) {
        this.keypair = Keypair.fromSecret(privateKey)
        this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org/')
    }

    private async fundWithFriendbot(): Promise<boolean> {

        try {
            const response = await fetch(
                `https://friendbot.stellar.org?addr=${encodeURIComponent(this.keypair.publicKey())}`
            );

            if (!response.ok) {
                throw new Error(`Account Funding failed with status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Friendbot funding successful:", result);

            // Wait for transaction to be processed
            await new Promise(resolve => setTimeout(resolve, 3000));
                        
            return true
        } catch (error) {
            console.error("Error with Friendbot:", error);
            return false;
        }
    }

    public async GetBalance() {
        try {
            const account = await this.server.loadAccount(this.keypair.publicKey())
            return account.balances
        } catch (error: any) {
            if (error.response?.status === 404 || error.message.includes('Not Found')) {
                console.log("Account not found, attempting to fund with Friendbot...");
                
                // // Fund the account with Friendbot (testnet only)
                const funded = await this.fundWithFriendbot();
                
                if (!funded) {
                    throw new Error('Failed to fund account with Friendbot');
                }

                // Retry loading the account after funding
                const account = await this.server.loadAccount(this.keypair.publicKey());
                return account.balances;
            } else {
                console.error("Error loading account: ", error);
                throw error;
            }
        }
    }
}