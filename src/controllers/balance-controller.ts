/// <reference path="../types/global.d.ts" />
import {
    Controller,
    Get,
    Route,
    Tags,
    Query,
    SuccessResponse,
    Example,
    Security,
    Request
} from 'tsoa';
import { ApiError } from '../utils/ApiError';
import { BalanceService } from '../services/balance-service';
import { StellarServices } from '../services/stellar/stella-services';
import { getChainConfig } from '../config/chains';
import { CustomRequest } from '../utils/request';
import { type Address } from 'viem';
import { Wallet } from '../models/wallet-models';

import {
    BalanceResponse,
    SupportedChainsResponse,
} from '../types/balance-types';


// Example data for Swagger
const exampleBalanceResponse: BalanceResponse = {
    success: true,
    walletAddress: '0xa5E0Da329eE5AA03f09228e534953496334080f5',
    nativeBalance: {
        balance: '125000000000000000',
        formatted: '0.125',
        currency: 'ETH',
        decimals: 18,
    },
    chainId: 8453,
    chainName: 'Base',
};

@Route('balance')
@Tags('Balance Service')
@Security('app')
@Security('bearer')
export class BalanceController extends Controller {
    private balanceService: BalanceService;

    constructor() {
        super();
        this.balanceService = new BalanceService();
    }

    /**
     * Get all supported chains for balance checking
     */
    @Get('chains')
    @SuccessResponse('200', 'Supported chains retrieved successfully')
    @Example<SupportedChainsResponse>({
        success: true,
        chains: [
            {
                chainId: 8453,
                name: 'Base',
                testnet: false,
                currency: 'ETH',
                explorerUrl: 'https://basescan.org',
                rpcUrl: 'https://mainnet.base.org',
                nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                },
            },
            {
                chainId: 11155111,
                name: 'Sepolia',
                testnet: true,
                currency: 'ETH',
                explorerUrl: 'https://sepolia.etherscan.io',
                rpcUrl: 'https://sepolia.infura.io/v3/',
                nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
            },
        ],
    })
    public async getSupportedChains(): Promise<SupportedChainsResponse> {
        try {
            const chains = this.balanceService.getSupportedChains();
            return {
                success: true,
                chains,
            };
        } catch (error) {
            console.error('Error getting supported chains:', error);
            throw new ApiError(
                500,
                'SERVICE_ERROR',
                `Failed to get supported chains: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Get native balance for a wallet address on a specific chain
     */
    @Get('native')
    @SuccessResponse('200', 'Native balance retrieved successfully')
    @Example<BalanceResponse>(exampleBalanceResponse)
    public async getBalance(
        @Request() request: CustomRequest,
        @Query() chainId?: number,
    ): Promise<BalanceResponse> {
        try {
            const walletAddress = request.user?.wallet.address;
            if (!walletAddress) {
                throw new ApiError(400, 'MISSING_ADDRESS', 'Wallet address is required');
            }
            // Default to Base mainnet if chainId not provided
            const targetChainId = chainId || 8453;
            
            // Get chain config for validation
            const config = getChainConfig(targetChainId);
            console.log("config: ", config)

            if (!config) {
                throw new ApiError(
                    400,
                    'UNSUPPORTED_CHAIN',
                    `Chain with ID ${targetChainId} is not supported`,
                );
            }

            const result = await this.balanceService.getBalance(
                walletAddress as Address,
                targetChainId,
            );

            return {
                success: true,
                walletAddress,
                nativeBalance: {
                    balance: result.balance,
                    formatted: result.formatted,
                    currency: result.currency,
                    decimals: result.decimals,
                },
                chainId: targetChainId,
                chainName: config.chain.name,
            };
        } catch (error) {
            console.error('Error fetching native balance:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                'BALANCE_ERROR',
                `Failed to fetch native balance: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Get native balances across multiple chains
     */
    @Get('balances')
    @SuccessResponse('200', 'Balances retrieved successfully')
    @Example<{ 
        success: boolean; 
        walletAddress: string; 
        balances: Array<{
            balance: string;
            formatted: string;
            chainId: number;
            currency: string;
            decimals: number;
            chainName: string;
        }>;
    }>({
        success: true,
        walletAddress: '0xa5E0Da329eE5AA03f09228e534953496334080f5',
        balances: [
            {
                balance: '125000000000000000',
                formatted: '0.125',
                chainId: 8453,
                currency: 'ETH',
                decimals: 18,
                chainName: 'Base',
            },
            {
                balance: '50000000000000000',
                formatted: '0.05',
                chainId: 11155111,
                currency: 'ETH',
                decimals: 18,
                chainName: 'Sepolia',
            },
        ],
    })
    public async getBalances(
        @Request() req: CustomRequest,
        @Query() chainIds?: string,
        @Query() network?: string,
    ): Promise<{
        success: boolean;
        walletAddress: string;
        balances: Array<{
            balance: string;
            formatted: string;
            chainId: number;
            currency: string;
            decimals: number;
            chainName: string;
        }>;
    }> {
        const walletAddress = req.user.wallet.address;
        const wallet  = await Wallet.findOne({address: walletAddress});
        const secretKey = wallet?.encryptedPrivateKey;

        if (!walletAddress) {
            throw new ApiError(400, 'MISSING_WALLET_ADDRESS', 'Wallet address is required');
        }

        if (network === "stellar" && !secretKey) {
            throw new ApiError(400, 'MISSING_SECRET_KEY', 'Secret key is required for stellar');
        }

        try {
            if (network && network === "stellar") {
                // Parse requested networks from query params
                let requestedNetworks: string[] = [];
                
                if (chainIds) {
                    // If chainIds is provided, map them to network names
                    const chainIdArray = chainIds.split(',').map(id => id.trim());
                    requestedNetworks = chainIdArray.map(chainId => {
                        switch (chainId) {
                            case '1': return 'mainnet';
                            case '2': return 'testnet';
                            case '3': return 'futurenet';
                            default: throw new ApiError(400, 'INVALID_CHAIN_ID', `Invalid chain ID: ${chainId}`);
                        }
                    });
                } else {
                    // Default to both testnet and mainnet if no specific chainIds provided
                    requestedNetworks = ['testnet', 'mainnet'];
                }
                
                const stellarService = new StellarServices(secretKey as string, requestedNetworks);
                const balances = await stellarService.getBalancesForAllNetworks();
                
                return {
                    success: true,
                    walletAddress,
                    balances
                };
            }
    
            // Parse chainIds from query parameter
            let targetChainIds: number[] | undefined;
            if (chainIds) {
                try {
                    targetChainIds = chainIds.split(',').map(id => {
                        const parsed = parseInt(id.trim(), 10);
                        if (isNaN(parsed)) {
                            throw new Error(`Invalid chain ID: ${id}`);
                        }
                        return parsed;
                    });
                } catch (error) {
                    throw new ApiError(
                        400,
                        'INVALID_CHAIN_IDS',
                        'chainIds must be comma-separated integers',
                    );
                }
            }

            const results = await this.balanceService.getBalances(
                walletAddress as Address,
                targetChainIds,
            );

            return {
                success: true,
                walletAddress,
                balances: results,
            };
        } catch (error) {
            console.error('Error fetching balances:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                'BALANCES_ERROR',
                `Failed to fetch balances: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }
}

// Export the instance for use in routes
const balanceController = new BalanceController();
export default balanceController;