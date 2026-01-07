// src/types/wallet-types.ts
export type ChainType = 'evm' | 'stellar';

export interface BaseWalletInfo {
    address: string;
    publicKey: string;
    chainType: ChainType;
}

export interface EVMWalletInfo extends BaseWalletInfo {
    chainType: 'evm';
    privateKey: string;
    mnemonic?: string;
}

export interface StellarWalletInfo extends BaseWalletInfo {
    chainType: 'stellar';
    secret: string;
}

export type WalletInfo = EVMWalletInfo | StellarWalletInfo;

export interface GenerateWalletRequest {
    chainType: ChainType;
    count?: number;
}

export interface RecoverWalletRequest {
    chainType: ChainType;
    mnemonicOrSecret: string;
}
