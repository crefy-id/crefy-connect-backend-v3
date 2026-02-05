import StellarSdk, { Keypair } from "@stellar/stellar-sdk";

const stellar_horizon_rpc = {
    "testnet": "https://horizon-testnet.stellar.org/",
    "futurenet": "https://horizon-futurenet.stellar.org",
    "mainnet": "https://horizon.stellar.org/" // Added mainnet
}

interface NetworkConfig {
    chainId: number;
    chainName: string;
    server: any;
}

export class StellarServices {
    private keypair: any;
    private networks: NetworkConfig[];

    constructor(
        privateKey: string, 
        requestedNetworks?: string[] // e.g., ["testnet", "mainnet"]
    ) {
        this.keypair = Keypair.fromSecret(privateKey);
        
        // Set default networks if none provided
        const networksToUse = requestedNetworks || ["testnet"];
        
        this.networks = networksToUse.map(network => {
            const rpcUrl = stellar_horizon_rpc[network as keyof typeof stellar_horizon_rpc];
            if (!rpcUrl) {
                throw new Error(`Unsupported network: ${network}`);
            }
            
            return {
                chainId: this.getChainId(network),
                chainName: `Stellar ${network.charAt(0).toUpperCase() + network.slice(1)}`,
                server: new StellarSdk.Horizon.Server(rpcUrl)
            };
        });
    }

    private getChainId(network: string): number {
        const chainIds: Record<string, number> = {
            "mainnet": 1,
            "testnet": 2,
            "futurenet": 3
        };
        return chainIds[network] || 999;
    }

    private async fundWithFriendbot(publicKey: string): Promise<boolean> {
        try {
            const response = await fetch(
                `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
            );

            if (!response.ok) {
                throw new Error(`Account Funding failed with status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Friendbot funding successful:", result);

            // Wait for transaction to be processed
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            return true;
        } catch (error) {
            console.error("Error with Friendbot:", error);
            return false;
        }
    }

    public async getBalancesForAllNetworks(): Promise<Array<{
        balance: string;
        formatted: string;
        chainId: number;
        currency: string;
        decimals: number;
        chainName: string;
    }>> {
        const allBalances: Array<{
            balance: string;
            formatted: string;
            chainId: number;
            currency: string;
            decimals: number;
            chainName: string;
        }> = [];

        for (const network of this.networks) {
            try {
                const account = await network.server.loadAccount(this.keypair.publicKey());
                
                // Process each balance entry
                account.balances.forEach((balanceEntry: any) => {
                    // Format the balance
                    const balance = balanceEntry.balance;
                    const formatted = parseFloat(balance).toFixed(7); // XLM has 7 decimals
                    
                    allBalances.push({
                        balance: balance,
                        formatted: formatted,
                        chainId: network.chainId,
                        currency: balanceEntry.asset_type === 'native' ? 'XLM' : balanceEntry.asset_code,
                        decimals: 7, // XLM has 7 decimal places
                        chainName: network.chainName
                    });
                });
                
            } catch (error: any) {
                // Handle account not found (only for testnet)
                if ((error.response?.status === 404 || error.message.includes('Not Found')) 
                    && network.chainId === 2) { // Only testnet has friendbot
                    
                    console.log(`Account not found on ${network.chainName}, attempting to fund with Friendbot...`);
                    
                    const funded = await this.fundWithFriendbot(this.keypair.publicKey());
                    
                    if (funded) {
                        // Retry loading the account after funding
                        const account = await network.server.loadAccount(this.keypair.publicKey());
                        
                        account.balances.forEach((balanceEntry: any) => {
                            const balance = balanceEntry.balance;
                            const formatted = parseFloat(balance).toFixed(7);
                            
                            allBalances.push({
                                balance: balance,
                                formatted: formatted,
                                chainId: network.chainId,
                                currency: balanceEntry.asset_type === 'native' ? 'XLM' : balanceEntry.asset_code,
                                decimals: 7,
                                chainName: network.chainName
                            });
                        });
                    }
                } else {
                    console.error(`Error loading account on ${network.chainName}:`, error);
                    // You might want to add a placeholder balance entry here
                    allBalances.push({
                        balance: "0",
                        formatted: "0.0000000",
                        chainId: network.chainId,
                        currency: "XLM",
                        decimals: 7,
                        chainName: network.chainName
                    });
                }
            }
        }

        return allBalances;
    }
}