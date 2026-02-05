/// <reference path="../types/global.d.ts" />
import {
    createPublicClient,
    http,
    formatUnits,
    type PublicClient,
    type Chain,
    type Address,
} from 'viem';
import { CHAINS, getChainConfig } from '../config/chains';

export class BalanceService {
    private publicClients: Map<number, PublicClient> = new Map();

    constructor() {
        this.publicClients = this.createPublicClients();
    }

    /**
     * Create public clients for all supported chains
     */
    private createPublicClients(): Map<number, PublicClient> {
        const clients = new Map<number, PublicClient>();
        
        Object.values(CHAINS).forEach((config) => {
            const client = createPublicClient({
                chain: config.chain,
                transport: http(),
            });
            clients.set(config.chain.id, client as PublicClient);
        });
        
        return clients;
    }

    /**
     * Get public client for a specific chain
     */
    private getClient(chainId: number): PublicClient | undefined {
        return this.publicClients.get(chainId);
    }

    /**
     * Get balance for an address on a specific chain
     */
    public async getBalance(
        address: Address,
        chainId: number
    ): Promise<{
        balance: string;
        formatted: string;
        chainId: number;
        currency: string;
        decimals: number;
    }> {
        const client = this.getClient(chainId);
        if (!client) {
            throw new Error(`Chain with ID ${chainId} is not supported`);
        }

        const chainConfig = getChainConfig(chainId);
        if (!chainConfig) {
            throw new Error(`Chain configuration not found for chain ID ${chainId}`);
        }

        try {
            const balance = await client.getBalance({ address });
            const formattedBalance = formatUnits(balance, chainConfig.chain.nativeCurrency.decimals);

            return {
                balance: balance.toString(),
                formatted: formattedBalance,
                chainId,
                currency: chainConfig.chain.nativeCurrency.symbol,
                decimals: chainConfig.chain.nativeCurrency.decimals,
            };
        } catch (error) {
            throw new Error(`Failed to get balance for address ${address} on chain ${chainId}: ${error}`);
        }
    }

    /**
     * Get balances for an address across multiple chains
     */
    public async getBalances(
        address: Address,
        chainIds?: number[]
    ): Promise<Array<{
        balance: string;
        formatted: string;
        chainId: number;
        currency: string;
        decimals: number;
        chainName: string;
    }>> {
        const chainsToCheck = chainIds || Array.from(this.publicClients.keys());
        const results = [];

        for (const chainId of chainsToCheck) {
            try {
                const balance = await this.getBalance(address, chainId);
                const chainConfig = getChainConfig(chainId);
                
                results.push({
                    ...balance,
                    chainName: chainConfig?.chain.name || 'Unknown Chain',
                });
            } catch (error) {
                console.error(`Error fetching balance for chain ${chainId}:`, error);
                // Continue with other chains even if one fails
                continue;
            }
        }

        return results;
    }

    /**
     * Get supported chains for balance checking
     */
    public getSupportedChains() {
        return Object.values(CHAINS).map((config) => ({
            chainId: config.chain.id,
            name: config.chain.name,
            testnet: config.testnet,
            currency: config.chain.nativeCurrency.symbol,
            explorerUrl: config.explorerUrl,
            rpcUrl: config.rpcUrl,
            nativeCurrency: config.chain.nativeCurrency,
        }));
    }
}

const balanceService = new BalanceService();
export default balanceService;