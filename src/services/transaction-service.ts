import {
    createPublicClient,
    createWalletClient,
    http,
    formatUnits,
    parseUnits,
    type PublicClient,
    type WalletClient,
    type Chain,
} from 'viem';
import { CHAINS, getChainConfig } from '../config/chains';
import { privateKeyToAccount } from 'viem/accounts';
import {
    SendTransactionRequest,
    SendTransactionResponse,
    TransactionHistoryRequest,
    TransactionHistoryResponse,
    GasPriceResponse,
    TransactionStatusResponse,
} from '../types/transaction-types';

// Standard ERC20 ABI for transfer function
const erc20Abi = [
    'function transfer(address to, uint256 value) returns (bool)',
    'function balanceOf(address) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
] as const;

export class TransactionService {
    private publicClients: Map<number, PublicClient> = new Map();
    private walletClients: Map<string, WalletClient> = new Map();

    /**
     * Get or create public client for a chain
     */
    private getPublicClient(chainId: number): PublicClient {
        if (!this.publicClients.has(chainId)) {
            const config = getChainConfig(chainId);
            const publicClient = createPublicClient({
                chain: config.chain as Chain,
                transport: http(config.rpcUrl),
            });
            this.publicClients.set(chainId, publicClient);
        }
        return this.publicClients.get(chainId)!;
    }

    /**
     * Get or create wallet client for a chain
     */
    private getWalletClient(
        chainId: number,
        privateKey: `0x${string}`,
    ): WalletClient {
        const key = `${chainId}-${privateKey}`;
        if (!this.walletClients.has(key)) {
            const config = getChainConfig(chainId);
            const account = privateKeyToAccount(privateKey);
            const walletClient = createWalletClient({
                account,
                chain: config.chain as Chain,
                transport: http(config.rpcUrl),
            });
            this.walletClients.set(key, walletClient);
        }
        return this.walletClients.get(key)!;
    }

    /**
     * Validate and format Ethereum address
     */
    private validateAddress(address: string): `0x${string}` {
        if (!address.startsWith('0x') || address.length !== 42) {
            throw new Error(`Invalid Ethereum address: ${address}`);
        }
        return address as `0x${string}`;
    }

    /**
     * Send transaction (native token or ERC20)
     */
    public async sendTransaction(
        request: SendTransactionRequest,
        privateKey: `0x${string}`,
    ): Promise<SendTransactionResponse> {
        try {
            const chainId = request.chainId;
            const config = getChainConfig(chainId);
            const publicClient = this.getPublicClient(chainId);
            const walletClient = this.getWalletClient(chainId, privateKey);

            const validatedFromAddress = this.validateAddress(
                request.fromAddress,
            );
            const validatedToAddress = this.validateAddress(request.toAddress);

            // Get nonce if not provided
            const nonce =
                request.nonce ??
                (await publicClient.getTransactionCount({
                    address: validatedFromAddress,
                    blockTag: 'pending',
                }));

            let transactionHash: `0x${string}`;

            if (request.tokenAddress) {
                // ERC20 token transfer
                const validatedTokenAddress = this.validateAddress(
                    request.tokenAddress,
                );

                // Get token decimals
                const decimals = (await publicClient.readContract({
                    address: validatedTokenAddress,
                    abi: erc20Abi,
                    functionName: 'decimals',
                })) as number;

                const value = parseUnits(request.value, decimals);

                // Prepare transaction for ERC20 transfer
                const { request: contractWrite } =
                    await publicClient.simulateContract({
                        address: validatedTokenAddress,
                        abi: erc20Abi,
                        functionName: 'transfer',
                        args: [validatedToAddress, value],
                        account: walletClient.account,
                    });

                transactionHash =
                    await walletClient.writeContract(contractWrite);
            } else {
                // Native token transfer
                const value = parseUnits(
                    request.value,
                    config.chain.nativeCurrency.decimals,
                );

                const transactionRequest: any = {
                    account: walletClient.account,
                    to: validatedToAddress,
                    value: value,
                    nonce: nonce,
                };

                // Add gas pricing
                if (request.maxFeePerGas && request.maxPriorityFeePerGas) {
                    transactionRequest.maxFeePerGas = parseUnits(
                        request.maxFeePerGas,
                        9,
                    ); // gwei
                    transactionRequest.maxPriorityFeePerGas = parseUnits(
                        request.maxPriorityFeePerGas,
                        9,
                    );
                } else {
                    const gasPrice = await publicClient.getGasPrice();
                    transactionRequest.gasPrice = gasPrice;
                }

                // Add gas limit if provided
                if (request.gasLimit) {
                    transactionRequest.gas = BigInt(request.gasLimit);
                }

                transactionHash =
                    await walletClient.sendTransaction(transactionRequest);
            }

            return {
                success: true,
                transactionHash,
                fromAddress: validatedFromAddress,
                toAddress: validatedToAddress,
                value: request.value,
                chainId,
                chainName: config.chain.name,
                tokenAddress: request.tokenAddress,
            };
        } catch (error) {
            console.error('Error sending transaction:', error);
            return {
                success: false,
                fromAddress: request.fromAddress,
                toAddress: request.toAddress,
                value: request.value,
                chainId: request.chainId,
                chainName: getChainConfig(request.chainId).chain.name,
                tokenAddress: request.tokenAddress,
                error: `Failed to send transaction: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            };
        }
    }

    /**
     * Get transaction history for a wallet
     */
    public async getTransactionHistory(
        request: TransactionHistoryRequest,
    ): Promise<TransactionHistoryResponse> {
        try {
            const publicClient = this.getPublicClient(request.chainId);
            const config = getChainConfig(request.chainId);
            const validatedAddress = this.validateAddress(
                request.walletAddress,
            );

            // Note: This is a simplified implementation
            // In production, you'd want to use a service like Alchemy, Moralis, or The Graph
            // for comprehensive transaction history

            const page = request.page || 1;
            const limit = request.limit || 10;

            // This is a basic implementation - you might want to use indexer services
            // for comprehensive transaction history
            const blockNumber = await publicClient.getBlockNumber();

            // For now, return empty array as placeholder
            // Implement proper transaction indexing based on your needs
            const transactions: any[] = [];

            return {
                success: true,
                transactions,
                walletAddress: validatedAddress,
                chainId: request.chainId,
                chainName: config.chain.name,
                page,
                limit,
                total: 0,
            };
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            return {
                success: false,
                transactions: [],
                walletAddress: request.walletAddress,
                chainId: request.chainId,
                chainName: getChainConfig(request.chainId).chain.name,
                page: request.page || 1,
                limit: request.limit || 10,
                total: 0,
                error: `Failed to fetch transaction history: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            };
        }
    }

    /**
     * Get current gas prices
     */
    public async getGasPrices(chainId: number): Promise<GasPriceResponse> {
        try {
            const publicClient = this.getPublicClient(chainId);
            const config = getChainConfig(chainId);

            const gasPrice = await publicClient.getGasPrice();

            // For EIP-1559 chains, estimate fees
            let maxFeePerGas, maxPriorityFeePerGas;

            try {
                const feeData = await publicClient.estimateFeesPerGas();
                if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
                    maxFeePerGas = formatUnits(feeData.maxFeePerGas, 9); // Convert to gwei
                    maxPriorityFeePerGas = formatUnits(
                        feeData.maxPriorityFeePerGas,
                        9,
                    );
                }
            } catch {
                // Fallback for non-EIP-1559 chains
                maxFeePerGas = formatUnits(gasPrice, 9);
                maxPriorityFeePerGas = formatUnits(gasPrice, 9);
            }

            return {
                success: true,
                gasPrice: formatUnits(gasPrice, 9), // Convert to gwei
                maxFeePerGas,
                maxPriorityFeePerGas,
                chainId,
                chainName: config.chain.name,
            };
        } catch (error) {
            console.error('Error fetching gas prices:', error);
            return {
                success: false,
                chainId,
                chainName: getChainConfig(chainId).chain.name,
                error: `Failed to fetch gas prices: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            };
        }
    }

    /**
     * Get transaction status
     */
    public async getTransactionStatus(
        chainId: number,
        transactionHash: string,
    ): Promise<TransactionStatusResponse> {
        try {
            const publicClient = this.getPublicClient(chainId);
            const validatedHash = this.validateAddress(transactionHash);

            const receipt = await publicClient.getTransactionReceipt({
                hash: validatedHash,
            });

            const currentBlock = await publicClient.getBlockNumber();
            const confirmations = receipt.blockNumber
                ? Number(currentBlock - receipt.blockNumber)
                : 0;

            return {
                success: true,
                transactionHash: validatedHash,
                status:
                    receipt.status === 'success'
                        ? 'success'
                        : receipt.status === 'reverted'
                          ? 'failed'
                          : 'pending',
                blockNumber: receipt.blockNumber
                    ? Number(receipt.blockNumber)
                    : undefined,
                confirmations,
                gasUsed: receipt.gasUsed?.toString(),
            };
        } catch (error) {
            console.error('Error fetching transaction status:', error);
            return {
                success: false,
                transactionHash,
                status: 'pending',
                confirmations: 0,
                error: `Failed to fetch transaction status: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            };
        }
    }

    /**
     * Estimate transaction gas
     */
    public async estimateGas(
        request: SendTransactionRequest,
        privateKey: `0x${string}`,
    ): Promise<{ success: boolean; gasEstimate?: string; error?: string }> {
        try {
            const chainId = request.chainId;
            const publicClient = this.getPublicClient(chainId);
            const walletClient = this.getWalletClient(chainId, privateKey);

            const validatedFromAddress = this.validateAddress(
                request.fromAddress,
            );
            const validatedToAddress = this.validateAddress(request.toAddress);

            if (request.tokenAddress) {
                // ERC20 token transfer gas estimation
                const validatedTokenAddress = this.validateAddress(
                    request.tokenAddress,
                );
                const decimals = (await publicClient.readContract({
                    address: validatedTokenAddress,
                    abi: erc20Abi,
                    functionName: 'decimals',
                })) as number;

                const value = parseUnits(request.value, decimals);

                const gasEstimate = await publicClient.estimateContractGas({
                    address: validatedTokenAddress,
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [validatedToAddress, value],
                    account: walletClient.account,
                });

                return {
                    success: true,
                    gasEstimate: gasEstimate.toString(),
                };
            } else {
                // Native token transfer gas estimation
                const config = getChainConfig(chainId);
                const value = parseUnits(
                    request.value,
                    config.chain.nativeCurrency.decimals,
                );

                const gasEstimate = await publicClient.estimateGas({
                    account: walletClient.account,
                    to: validatedToAddress,
                    value: value,
                });

                return {
                    success: true,
                    gasEstimate: gasEstimate.toString(),
                };
            }
        } catch (error) {
            console.error('Error estimating gas:', error);
            return {
                success: false,
                error: `Failed to estimate gas: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            };
        }
    }
}

const transactionService = new TransactionService();
export default transactionService;
