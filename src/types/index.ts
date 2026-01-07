import { Document, Types } from 'mongoose';

export interface IWallet extends Document {
    _id: Types.ObjectId;
    appId: string;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    subname?: string | undefined;
    socialType: string;
    address: string;
    publicKey: string;
    encryptedPrivateKey: string;
    encryptionSalt: string;
    userData?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    otp?: string | undefined;
    otpExpiry?: Date | undefined;
    oauthTokens?: {
        accessToken?: string | undefined;
        refreshToken?: string | undefined;
    };
}

// Lean version without Mongoose document methods
export interface IWalletLean {
    _id: Types.ObjectId;
    appId: string;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    subname?: string | undefined;
    socialType: string;
    address: string;
    publicKey: string;
    encryptedPrivateKey: string;
    encryptionSalt: string;
    userData?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    otp?: string | undefined;
    otpExpiry?: Date | undefined;
    oauthTokens?: {
        accessToken?: string | undefined;
        refreshToken?: string | undefined;
    };
    __v?: number;
}

export interface IWalletResponse {
    _id: string;
    appId: string;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    subname?: string | undefined;
    socialType: string;
    address: string;
    publicKey: string;
    encryptedPrivateKey?: string | undefined;
    encryptionSalt?: string | undefined;
    userData?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    otp?: string | undefined;
    otpExpiry?: Date | undefined;
    oauthTokens?: {
        accessToken?: string | undefined;
        refreshToken?: string | undefined;
    };
}

export interface JwtPayload {
    walletId: string;
    appId: string;
    address: string;
    iat?: number;
    exp?: number;
}
