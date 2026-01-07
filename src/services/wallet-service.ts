import {
    english,
    generateMnemonic,
    mnemonicToAccount,
    privateKeyToAccount,
} from 'viem/accounts';
import { toHex } from 'viem/utils';
import { Keypair } from '@stellar/stellar-sdk';

/**
 * Custom error class for wallet generation failures
 */
export class WalletServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WalletServiceError';
    }
}

/**
 * Supported blockchain networks
 */
export enum BlockchainNetwork {
    EVM = 'evm',
    STELLAR = 'stellar',
    SOLANA = 'solana', // Future support
}

/**
 * Interface for wallet information
 */
export interface WalletInfo {
    address: string;
    privateKey: string;
    mnemonic?: string;
    publicKey: string;
    network: BlockchainNetwork;
    secret?: string; // For Stellar
}

/**
 * Extended wallet info with app context
 */
export interface AppWalletInfo extends WalletInfo {
    appId: string;
    socialType: string;
    userData: string;
    isActive: boolean;
    encryptionSalt: string;
}

/**
 * Service for generating cryptocurrency wallets across multiple blockchains
 */
class WalletService {
    private readonly mnemonicStrength: number = 128;

    /**
     * Generates a new cryptocurrency wallet
     * @param network - Blockchain network to generate wallet for
     * @param options - Additional options
     * @returns Promise resolving to WalletInfo object
     * @throws {WalletServiceError} When wallet generation fails
     */
    public async generateWallet(
        network: BlockchainNetwork = BlockchainNetwork.EVM,
        options?: { mnemonic?: string },
    ): Promise<WalletInfo> {
        try {
            switch (network) {
                case BlockchainNetwork.EVM:
                    return await this.generateEVMWallet(options?.mnemonic);
                case BlockchainNetwork.STELLAR:
                    return await this.generateStellarWallet(options?.mnemonic);
                default:
                    throw new WalletServiceError(
                        `Unsupported network: ${network}`,
                    );
            }
        } catch (error) {
            throw this.handleGenerationError(error);
        }
    }

    /**
     * Generates an EVM-compatible wallet (Ethereum, Polygon, etc.)
     */
    private async generateEVMWallet(mnemonic?: string): Promise<WalletInfo> {
        try {
            const walletMnemonic = mnemonic || this.generateMnemonic();
            const account = mnemonicToAccount(walletMnemonic);
            const privateKey = this.extractPrivateKey(account);

            // Validate consistency
            this.validateEVMWalletConsistency(account, privateKey);

            return {
                address: account.address,
                privateKey,
                mnemonic: walletMnemonic,
                publicKey: account.publicKey,
                network: BlockchainNetwork.EVM,
            };
        } catch (error) {
            throw new WalletServiceError(
                `EVM wallet generation failed: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Generates a Stellar wallet
     */
    private async generateStellarWallet(
        mnemonic?: string,
    ): Promise<WalletInfo> {
        try {
            let keypair: Keypair;

            if (mnemonic) {
                // For Stellar, we need to derive from mnemonic differently
                // This is a simplified approach - in production you'd want proper BIP39 derivation
                keypair = this.deriveStellarKeypairFromMnemonic(mnemonic);
            } else {
                keypair = Keypair.random();
            }

            return {
                address: keypair.publicKey(),
                privateKey: keypair.secret(),
                publicKey: keypair.publicKey(),
                mnemonic: mnemonic || '',
                network: BlockchainNetwork.STELLAR,
                secret: keypair.secret(), // Alias for privateKey in Stellar context
            };
        } catch (error) {
            throw new WalletServiceError(
                `Stellar wallet generation failed: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Derive Stellar keypair from mnemonic (simplified implementation)
     * Note: In production, use proper BIP39/44 derivation
     */
    private deriveStellarKeypairFromMnemonic(mnemonic: string): Keypair {
        try {
            // Simplified derivation - you should implement proper HD wallet derivation
            // This is just for demonstration
            const hash = require('crypto').createHash('sha256');
            hash.update(mnemonic);
            const seed = hash.digest().slice(0, 32); // 32 bytes for Stellar seed

            return Keypair.fromRawEd25519Seed(seed);
        } catch (error) {
            throw new WalletServiceError(
                `Failed to derive Stellar keypair from mnemonic: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Recover wallet from mnemonic for specific network
     */
    public recoverWalletFromMnemonic(
        mnemonic: string,
        network: BlockchainNetwork = BlockchainNetwork.EVM,
    ): WalletInfo {
        try {
            switch (network) {
                case BlockchainNetwork.EVM:
                    return this.recoverEVMWalletFromMnemonic(mnemonic);
                case BlockchainNetwork.STELLAR:
                    return this.recoverStellarWalletFromMnemonic(mnemonic);
                default:
                    throw new WalletServiceError(
                        `Unsupported network for recovery: ${network}`,
                    );
            }
        } catch (error) {
            throw new WalletServiceError(
                `Wallet recovery failed: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Recover EVM wallet from mnemonic
     */
    private recoverEVMWalletFromMnemonic(mnemonic: string): WalletInfo {
        const account = mnemonicToAccount(mnemonic);
        const privateKey = this.extractPrivateKey(account);

        return {
            address: account.address,
            privateKey,
            mnemonic,
            publicKey: account.publicKey,
            network: BlockchainNetwork.EVM,
        };
    }

    /**
     * Recover Stellar wallet from mnemonic
     */
    private recoverStellarWalletFromMnemonic(mnemonic: string): WalletInfo {
        const keypair = this.deriveStellarKeypairFromMnemonic(mnemonic);

        return {
            address: keypair.publicKey(),
            privateKey: keypair.secret(),
            publicKey: keypair.publicKey(),
            mnemonic,
            network: BlockchainNetwork.STELLAR,
            secret: keypair.secret(),
        };
    }

    /**
     * Import wallet from private key for specific network
     */
    public importWalletFromPrivateKey(
        privateKey: string,
        network: BlockchainNetwork = BlockchainNetwork.EVM,
    ): WalletInfo {
        try {
            switch (network) {
                case BlockchainNetwork.EVM:
                    return this.importEVMWalletFromPrivateKey(privateKey);
                case BlockchainNetwork.STELLAR:
                    return this.importStellarWalletFromSecret(privateKey);
                default:
                    throw new WalletServiceError(
                        `Unsupported network for import: ${network}`,
                    );
            }
        } catch (error) {
            throw new WalletServiceError(
                `Wallet import failed: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    /**
     * Import EVM wallet from private key
     */
    private importEVMWalletFromPrivateKey(privateKey: string): WalletInfo {
        const account = privateKeyToAccount(privateKey as `0x${string}`);

        return {
            address: account.address,
            privateKey,
            publicKey: account.publicKey,
            network: BlockchainNetwork.EVM,
        };
    }

    /**
     * Import Stellar wallet from secret
     */
    private importStellarWalletFromSecret(secret: string): WalletInfo {
        const keypair = Keypair.fromSecret(secret);

        return {
            address: keypair.publicKey(),
            privateKey: secret,
            publicKey: keypair.publicKey(),
            network: BlockchainNetwork.STELLAR,
            secret: secret,
        };
    }

    /**
     * Validates a wallet address for a specific network
     */
    public validateWalletAddress(
        address: string,
        network: BlockchainNetwork,
    ): boolean {
        try {
            switch (network) {
                case BlockchainNetwork.EVM:
                    return this.validateEVMAddress(address);
                case BlockchainNetwork.STELLAR:
                    return this.validateStellarAddress(address);
                default:
                    return false;
            }
        } catch {
            return false;
        }
    }

    /**
     * Validates EVM address format
     */
    private validateEVMAddress(address: string): boolean {
        // Basic EVM address validation
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    /**
     * Validates Stellar address format
     */
    private validateStellarAddress(address: string): boolean {
        // Basic Stellar address validation
        return /^G[A-Z0-9]{55}$/.test(address);
    }

    // Existing methods remain mostly the same, but updated to work with network parameter

    private generateMnemonic(): string {
        return generateMnemonic(english, this.mnemonicStrength);
    }

    private extractPrivateKey(account: any): string {
        const privateKey = account.getHdKey().privateKey;
        if (!privateKey) {
            throw new WalletServiceError(
                'Failed to extract private key from mnemonic',
            );
        }
        return toHex(privateKey);
    }

    private validateEVMWalletConsistency(
        mnemonicAccount: any,
        privateKey: string,
    ): void {
        const privateKeyAccount = privateKeyToAccount(
            privateKey as `0x${string}`,
        );

        if (
            mnemonicAccount.address.toLowerCase() !==
            privateKeyAccount.address.toLowerCase()
        ) {
            throw new WalletServiceError(
                'Address mismatch between mnemonic and private key derivation',
            );
        }
    }

    private handleGenerationError(error: unknown): WalletServiceError {
        console.error('Wallet generation failed:', error);

        if (error instanceof WalletServiceError) {
            return error;
        }

        const message =
            error instanceof Error
                ? error.message
                : 'Unknown error occurred during wallet generation';

        return new WalletServiceError(message);
    }

    /**
     * Generates multiple wallets in batch for a specific network
     */
    public async generateMultipleWallets(
        count: number,
        network: BlockchainNetwork = BlockchainNetwork.EVM,
    ): Promise<WalletInfo[]> {
        if (count <= 0) {
            throw new WalletServiceError('Count must be greater than 0');
        }

        if (count > 100) {
            throw new WalletServiceError(
                'Cannot generate more than 100 wallets at once',
            );
        }

        const wallets: WalletInfo[] = [];

        for (let i = 0; i < count; i++) {
            try {
                const wallet = await this.generateWallet(network);
                wallets.push(wallet);
            } catch (error) {
                console.error(`Failed to generate wallet ${i + 1}:`, error);
                throw new WalletServiceError(
                    `Failed to generate wallet ${i + 1}`,
                );
            }
        }

        return wallets;
    }

    /**
     * Validates a mnemonic phrase for a specific network
     */
    public validateMnemonic(
        mnemonic: string,
        network: BlockchainNetwork = BlockchainNetwork.EVM,
    ): boolean {
        try {
            switch (network) {
                case BlockchainNetwork.EVM:
                    mnemonicToAccount(mnemonic);
                    return true;
                case BlockchainNetwork.STELLAR:
                    // Try to derive from mnemonic
                    this.deriveStellarKeypairFromMnemonic(mnemonic);
                    return true;
                default:
                    return false;
            }
        } catch {
            return false;
        }
    }
}

// Export singleton instance
export const walletService = new WalletService();
export default walletService;
