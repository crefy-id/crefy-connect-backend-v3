import {
    Controller,
    Post,
    Get,
    Route,
    Tags,
    Body,
    Query,
    SuccessResponse,
    Example,
    Security,
    Request,
} from 'tsoa';
import { ApiError } from '../utils/ApiError';
import { Request as ExpressRequest } from 'express';
import { Wallet } from '../models/wallet-models';
import { TransactionService } from '../services/transaction-service';
import {
    SendTransactionRequest,
    SendTransactionResponse,
    TransactionHistoryRequest,
    TransactionHistoryResponse,
    GasPriceResponse,
    TransactionStatusResponse,
} from '../types/transaction-types';

@Route('transactions')
@Tags('Transaction Service')
@Security('app')
@Security('bearer')
export class TransactionController extends Controller {
    private transactionService: TransactionService;

    constructor() {
        super();
        this.transactionService = new TransactionService();
    }

    /**
     * Send transaction (native token or ERC20)
     */
    @Post('send')
    @SuccessResponse('200', 'Transaction sent successfully')
    @Example<SendTransactionResponse>({
        success: true,
        transactionHash:
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        fromAddress: '0xa5E0Da329eE5AA03f09228e534953496334080f5',
        toAddress: '0x742E6B6D8B6C4e8D8e8D8e8D8e8D8e8D8e8D8e8D',
        value: '0.1',
        chainId: 8453,
        chainName: 'Base',
    })
    public async sendTransaction(
        @Body() body: SendTransactionRequest,
        @Request() request: ExpressRequest,
    ): Promise<SendTransactionResponse> {
        try {
            const { wallet: basicWallet } = (request as any).user;
            const completeWallet = await Wallet.findOne({
                address: basicWallet.address,
            }).select('+encryptedPrivateKey +encryptionSalt');

            if (!completeWallet?.encryptedPrivateKey) {
                throw new ApiError(
                    400,
                    'WALLET_ERROR',
                    'No wallet found or private key not available',
                );
            }

            // Validate addresses
            if (
                !body.fromAddress.startsWith('0x') ||
                body.fromAddress.length !== 42
            ) {
                throw new ApiError(
                    400,
                    'INVALID_FROM_ADDRESS',
                    'Invalid from address format',
                );
            }
            if (
                !body.toAddress.startsWith('0x') ||
                body.toAddress.length !== 42
            ) {
                throw new ApiError(
                    400,
                    'INVALID_TO_ADDRESS',
                    'Invalid to address format',
                );
            }

            const privateKey =
                completeWallet.encryptedPrivateKey as `0x${string}`;
            const result = await this.transactionService.sendTransaction(
                body,
                privateKey,
            );

            if (result.success) {
                return result;
            } else {
                throw new ApiError(
                    400,
                    'SEND_TRANSACTION_FAILED',
                    result.error || 'Failed to send transaction',
                );
            }
        } catch (error) {
            console.error('Error sending transaction:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                'SEND_TRANSACTION_ERROR',
                `Failed to send transaction: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Get transaction history for a wallet
     */
    @Post('history')
    @SuccessResponse('200', 'Transaction history retrieved successfully')
    @Example<TransactionHistoryResponse>({
        success: true,
        transactions: [
            {
                hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                from: '0xa5E0Da329eE5AA03f09228e534953496334080f5',
                to: '0x742E6B6D8B6C4e8D8e8D8e8D8e8D8e8D8e8D8e8D',
                value: '1000000000000000000',
                timestamp: 1672531200,
                blockNumber: 12345678,
                status: 'success',
                gasUsed: '21000',
                gasPrice: '20000000000',
            },
        ],
        walletAddress: '0xa5E0Da329eE5AA03f09228e534953496334080f5',
        chainId: 8453,
        chainName: 'Base',
        page: 1,
        limit: 10,
        total: 1,
    })
    public async getTransactionHistory(
        @Body() body: TransactionHistoryRequest,
    ): Promise<TransactionHistoryResponse> {
        try {
            // Validate wallet address
            if (
                !body.walletAddress.startsWith('0x') ||
                body.walletAddress.length !== 42
            ) {
                throw new ApiError(
                    400,
                    'INVALID_ADDRESS',
                    'Invalid wallet address format',
                );
            }

            const result =
                await this.transactionService.getTransactionHistory(body);

            if (result.success) {
                return result;
            } else {
                throw new ApiError(
                    400,
                    'HISTORY_FETCH_FAILED',
                    result.error || 'Failed to fetch transaction history',
                );
            }
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                'HISTORY_ERROR',
                `Failed to fetch transaction history: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Get current gas prices for a chain
     */
    @Get('gas-prices')
    @SuccessResponse('200', 'Gas prices retrieved successfully')
    @Example<GasPriceResponse>({
        success: true,
        gasPrice: '30.5',
        maxFeePerGas: '32.1',
        maxPriorityFeePerGas: '1.5',
        chainId: 8453,
        chainName: 'Base',
    })
    public async getGasPrices(
        @Query() chainId: string,
    ): Promise<GasPriceResponse> {
        try {
            const chainIdNumber = parseInt(chainId, 10);
            if (isNaN(chainIdNumber)) {
                throw new ApiError(
                    400,
                    'INVALID_CHAIN_ID',
                    'Chain ID must be a valid number',
                );
            }

            const result =
                await this.transactionService.getGasPrices(chainIdNumber);

            if (result.success) {
                return result;
            } else {
                throw new ApiError(
                    400,
                    'GAS_PRICE_FETCH_FAILED',
                    result.error || 'Failed to fetch gas prices',
                );
            }
        } catch (error) {
            console.error('Error fetching gas prices:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                'GAS_PRICE_ERROR',
                `Failed to fetch gas prices: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Get transaction status
     */
    @Get('status')
    @SuccessResponse('200', 'Transaction status retrieved successfully')
    @Example<TransactionStatusResponse>({
        success: true,
        transactionHash:
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        status: 'success',
        blockNumber: 12345678,
        confirmations: 15,
        gasUsed: '21000',
    })
    public async getTransactionStatus(
        @Query() chainId: string,
        @Query() transactionHash: string,
    ): Promise<TransactionStatusResponse> {
        try {
            const chainIdNumber = parseInt(chainId, 10);
            if (isNaN(chainIdNumber)) {
                throw new ApiError(
                    400,
                    'INVALID_CHAIN_ID',
                    'Chain ID must be a valid number',
                );
            }

            if (
                !transactionHash.startsWith('0x') ||
                transactionHash.length !== 66
            ) {
                throw new ApiError(
                    400,
                    'INVALID_TRANSACTION_HASH',
                    'Invalid transaction hash format',
                );
            }

            const result = await this.transactionService.getTransactionStatus(
                chainIdNumber,
                transactionHash,
            );

            if (result.success) {
                return result;
            } else {
                throw new ApiError(
                    400,
                    'STATUS_FETCH_FAILED',
                    result.error || 'Failed to fetch transaction status',
                );
            }
        } catch (error) {
            console.error('Error fetching transaction status:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                'STATUS_ERROR',
                `Failed to fetch transaction status: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Estimate transaction gas
     */
    @Post('estimate-gas')
    @SuccessResponse('200', 'Gas estimated successfully')
    @Example<{ success: boolean; gasEstimate?: string; error?: string }>({
        success: true,
        gasEstimate: '21000',
    })
    public async estimateGas(
        @Body() body: SendTransactionRequest,
        @Request() request: ExpressRequest,
    ): Promise<{ success: boolean; gasEstimate?: string; error?: string }> {
        try {
            const { wallet: basicWallet } = (request as any).user;
            const completeWallet = await Wallet.findOne({
                address: basicWallet.address,
            }).select('+encryptedPrivateKey +encryptionSalt');

            if (!completeWallet?.encryptedPrivateKey) {
                throw new ApiError(
                    400,
                    'WALLET_ERROR',
                    'No wallet found or private key not available',
                );
            }

            // Validate addresses
            if (
                !body.fromAddress.startsWith('0x') ||
                body.fromAddress.length !== 42
            ) {
                throw new ApiError(
                    400,
                    'INVALID_FROM_ADDRESS',
                    'Invalid from address format',
                );
            }
            if (
                !body.toAddress.startsWith('0x') ||
                body.toAddress.length !== 42
            ) {
                throw new ApiError(
                    400,
                    'INVALID_TO_ADDRESS',
                    'Invalid to address format',
                );
            }

            const privateKey =
                completeWallet.encryptedPrivateKey as `0x${string}`;
            const result = await this.transactionService.estimateGas(
                body,
                privateKey,
            );

            if (result.success) {
                return result;
            } else {
                throw new ApiError(
                    400,
                    'GAS_ESTIMATE_FAILED',
                    result.error || 'Failed to estimate gas',
                );
            }
        } catch (error) {
            console.error('Error estimating gas:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                500,
                'GAS_ESTIMATE_ERROR',
                `Failed to estimate gas: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }
}

const transactionController = new TransactionController();
export default transactionController;
