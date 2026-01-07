import { Document, Schema, model, Model } from 'mongoose';

export enum BlockchainNetwork {
    EVM = 'evm',
    STELLAR = 'stellar',
    SOLANA = 'solana',
}

export interface IOAuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

export interface IWallet extends Document {
    appId: string;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    subname?: string | undefined;
    socialType: string;
    network: BlockchainNetwork; // Add network field
    address: string;
    publicKey: string;
    encryptedPrivateKey: string;
    encryptionSalt: string;
    userData?: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    otp?: string;
    otpExpiry?: Date;
    oauthTokens?: IOAuthTokens;
}

const WalletSchema = new Schema<IWallet>(
    {
        appId: {
            type: String,
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: false,
            index: true,
            sparse: true,
        },
        phoneNumber: {
            type: String,
            required: false,
            index: true,
            sparse: true,
        },
        subname: {
            type: String,
            required: false,
        },
        socialType: {
            type: String,
            required: true,
        },
        network: {
            type: String,
            required: true,
            enum: Object.values(BlockchainNetwork),
            default: BlockchainNetwork.EVM,
        },
        address: {
            type: String,
            required: true,
            index: true,
        },
        publicKey: {
            type: String,
            required: true,
        },
        encryptedPrivateKey: {
            type: String,
            required: true,
        },
        encryptionSalt: {
            type: String,
            required: true,
        },
        userData: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            required: false,
        },
        otpExpiry: {
            type: Date,
            required: false,
        },
        oauthTokens: {
            accessToken: { type: String },
            refreshToken: { type: String },
        },
    },
    {
        timestamps: true,
    },
);

// Update compound indexes to include network
WalletSchema.index({ appId: 1, address: 1, network: 1 }, { unique: true });
WalletSchema.index(
    { appId: 1, email: 1, network: 1 },
    {
        unique: true,
        sparse: true,
        partialFilterExpression: { email: { $type: 'string' } },
    },
);

// Static method for finding by identifier and network
WalletSchema.statics.findByIdentifierAndNetwork = function (
    appId: string,
    identifier: string,
    network: BlockchainNetwork = BlockchainNetwork.EVM,
) {
    return this.findOne({
        appId,
        network,
        $or: [{ email: identifier }, { phoneNumber: identifier }],
    });
};

export const Wallet: Model<IWallet> = model<IWallet>('Wallet', WalletSchema);
