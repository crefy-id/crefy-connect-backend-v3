// balance-types.ts - Simplified version
export interface NativeBalance {
    balance: string;
    formatted: string;
    currency: string;
    decimals: number;
}

export interface BalanceResponse {
    success: boolean;
    walletAddress: string;
    nativeBalance: NativeBalance;
    chainId: number;
    chainName: string;
}

export interface SupportedChain {
    chainId: number;
    name: string;
    testnet: boolean;
    currency: string;
    explorerUrl: string;
    rpcUrl: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}

export interface SupportedChainsResponse {
    success: boolean;
    chains: SupportedChain[];
}

// For query parameters
export interface GetBalanceQueryParams {
    walletAddress: string;
    chainId?: number;
}

export interface GetBalancesQueryParams {
    walletAddress: string;
    chainIds?: string; // comma-separated list
}