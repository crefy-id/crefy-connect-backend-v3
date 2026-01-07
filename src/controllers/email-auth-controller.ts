import {
    Controller,
    Post,
    Route,
    Tags,
    Body,
    SuccessResponse,
    Request,
    Example,
    Security,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import crypto from 'crypto';
import { Wallet } from '../models/wallet-models';
import { ApiError } from '../utils/ApiError';
import {
    generateJWT,
    verifyJWT,
    generateOTP,
    expireOTP,
    validateEmail,
} from '../utils/auth';
import walletService, { BlockchainNetwork } from '../services/wallet-service';
import emailService from '../config/email-config';

// Request interfaces
interface EmailLoginRequest {
    email: string;
    network?: BlockchainNetwork;
}

interface VerifyOTPRequest {
    email: string;
    otp: string;
    network?: BlockchainNetwork;
}

interface ResendOTPRequest {
    email: string;
    network?: BlockchainNetwork;
}

// Response interfaces
interface EmailLoginResponse {
    success: boolean;
    message: string;
    isActive?: boolean;
    walletExists?: boolean;
    network?: BlockchainNetwork;
}

interface VerifyOTPResponse {
    success: boolean;
    message: string;
    data?: {
        walletAddress: string;
        socialType: string;
        userData: string;
        network: BlockchainNetwork;
    };
    isActive?: boolean;
    token?: string;
}

interface ResendOTPResponse {
    success: boolean;
    message: string;
}

@Route('auth/email')
@Tags('Email Authentication')
@Security('app')
export class EmailAuthController extends Controller {
    /**
     * Login or register with email
     * Sends OTP to email for verification
     * @example requestBody {"email": "user@example.com", "network": "stellar"}
     */
    @Post('login')
    @SuccessResponse('200', 'OTP sent successfully')
    @Example<EmailLoginResponse>({
        success: true,
        message: 'OTP sent to email for verification',
        isActive: false,
        walletExists: false,
        network: BlockchainNetwork.STELLAR,
    })
    @Security('app')
    public async emailLogin(
        @Body() body: EmailLoginRequest,
        @Request() request: ExpressRequest,
    ): Promise<EmailLoginResponse> {
        const { app } = (request as any).user;
        const { email, network = BlockchainNetwork.EVM } = body;
        const token = request.header('Authorization')?.replace('Bearer ', '');

        this.validateEmailInput(email);

        const normalizedEmail = email.toLowerCase();
        const existingWallet = await this.findWalletByEmailAndNetwork(
            normalizedEmail,
            app.appId,
            network,
        );

        if (
            token &&
            (await this.isValidTokenForWallet(token, existingWallet))
        ) {
            return {
                success: true,
                message: 'User already logged in',
                isActive: true,
                network: network,
            };
        }

        const otp = generateOTP();
        const otpExpiry = expireOTP(otp);

        if (existingWallet) {
            await this.handleExistingWallet(
                existingWallet,
                otp,
                otpExpiry,
                normalizedEmail,
            );
            return {
                success: true,
                message: 'OTP sent to email for verification',
                isActive: existingWallet.isActive,
                walletExists: true,
                network: network,
            };
        }

        await this.handleNewWallet(
            normalizedEmail,
            app.appId,
            otp,
            otpExpiry,
            network,
        );
        return {
            success: true,
            message: 'OTP sent to email for verification',
            isActive: false,
            walletExists: false,
            network: network,
        };
    }

    /**
     * Verify OTP and activate wallet
     * @example requestBody {"email": "user@example.com", "otp": "123456", "network": "stellar"}
     */
    @Post('verify')
    @SuccessResponse('200', 'Wallet verified successfully')
    @Example<VerifyOTPResponse>({
        success: true,
        message: 'Wallet verified successfully',
        data: {
            walletAddress: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEF',
            socialType: 'email',
            userData:
                '{"email":"user@example.com","network":"stellar","secret":"S..."}',
            network: BlockchainNetwork.STELLAR,
        },
        isActive: true,
        token: 'jwt-token-here',
    })
    public async verifyOTP(
        @Body() body: VerifyOTPRequest,
        @Request() request: ExpressRequest,
    ): Promise<VerifyOTPResponse> {
        const { app } = (request as any).user;
        const { email, otp, network = BlockchainNetwork.EVM } = body;

        this.validateEmailInput(email);

        const normalizedEmail = email.toLowerCase();
        const wallet = await this.findWalletByEmailAndNetwork(
            normalizedEmail,
            app.appId,
            network,
        );

        if (!wallet) {
            throw new ApiError(404, 'WALLET_NOT_FOUND', 'Wallet not found');
        }

        const token = request.header('Authorization')?.replace('Bearer ', '');
        if (
            token &&
            wallet.isActive &&
            (await this.isValidTokenForWallet(token, wallet))
        ) {
            return {
                success: true,
                message: 'User already logged in',
                data: this.formatWalletData(wallet),
                isActive: true,
                token: token,
            };
        }

        this.validateOTP(wallet, otp);
        await this.activateWallet(wallet);

        const newToken = generateJWT({
            address: wallet.address,
            network: wallet.network, // Include network in JWT
        });

        return {
            success: true,
            message: 'Wallet verified successfully',
            data: this.formatWalletData(wallet),
            isActive: true,
            token: newToken,
        };
    }

    /**
     * Resend OTP to email
     * @example requestBody {"email": "user@example.com", "network": "stellar"}
     */
    @Post('resend-otp')
    @SuccessResponse('200', 'OTP resent successfully')
    @Example<ResendOTPResponse>({
        success: true,
        message: 'OTP resent to email for verification',
    })
    public async resendOTP(
        @Body() body: ResendOTPRequest,
        @Request() request: ExpressRequest,
    ): Promise<ResendOTPResponse> {
        const { app } = (request as any).user;
        const { email, network = BlockchainNetwork.EVM } = body;

        const normalizedEmail = email.toLowerCase();
        const wallet = await this.findWalletByEmailAndNetwork(
            normalizedEmail,
            app.appId,
            network,
        );

        if (!wallet) {
            throw new ApiError(404, 'WALLET_NOT_FOUND', 'Wallet not found');
        }

        const otp = generateOTP();
        const otpExpiry = expireOTP(otp);

        await this.updateWalletOTP(wallet, otp, otpExpiry);
        await this.sendOTPEmail(normalizedEmail, otp.toString());

        return {
            success: true,
            message: 'OTP resent to email for verification',
        };
    }

    // Private helper methods

    private validateEmailInput(email: string): void {
        if (!validateEmail(email)) {
            throw new ApiError(
                400,
                'VALIDATION_ERROR',
                'Valid email is required',
            );
        }
    }

    private async findWalletByEmailAndNetwork(
        email: string,
        appId: string,
        network: BlockchainNetwork = BlockchainNetwork.EVM,
    ) {
        return await Wallet.findOne({
            email,
            socialType: 'email',
            appId,
            network,
        });
    }

    private async isValidTokenForWallet(
        token: string,
        wallet: any,
    ): Promise<boolean> {
        try {
            const decoded = verifyJWT(token);
            return (
                wallet &&
                wallet.address === decoded.address &&
                wallet.network === decoded.network &&
                wallet.isActive
            );
        } catch (error) {
            return false;
        }
    }

    private async handleExistingWallet(
        wallet: any,
        otp: number,
        otpExpiry: Date,
        email: string,
    ): Promise<void> {
        await this.updateWalletOTP(wallet, otp, otpExpiry);
        await this.sendOTPEmail(email, otp.toString());
    }

    private async handleNewWallet(
        email: string,
        appId: string,
        otp: number,
        otpExpiry: Date,
        network: BlockchainNetwork = BlockchainNetwork.EVM,
    ): Promise<void> {
        const walletInfo = await walletService.generateWallet(network);
        const encryptionSalt = crypto.randomBytes(16).toString('hex');

        // Prepare userData based on network
        const userData: any = {
            email,
            network,
        };

        // Add network-specific data
        if (network === BlockchainNetwork.STELLAR && walletInfo.secret) {
            userData.secret = walletInfo.secret;
            // For Stellar, we might want to store the secret more securely
            // Consider encrypting it separately
        }

        const walletData = {
            appId,
            email,
            socialType: 'email',
            address: walletInfo.address,
            publicKey: walletInfo.publicKey,
            encryptedPrivateKey: walletInfo.privateKey,
            encryptionSalt,
            userData: JSON.stringify(userData),
            isActive: false,
            otp: otp.toString(),
            otpExpiry,
            network,
        };

        await Wallet.create(walletData);
        await this.sendOTPEmail(email, otp.toString());
    }

    private async updateWalletOTP(
        wallet: any,
        otp: number,
        otpExpiry: Date,
    ): Promise<void> {
        wallet.otp = otp.toString();
        wallet.otpExpiry = otpExpiry;
        await wallet.save();
    }

    private async activateWallet(wallet: any): Promise<void> {
        wallet.isActive = true;
        wallet.otp = undefined;
        wallet.otpExpiry = undefined;
        await wallet.save();
    }

    private async sendOTPEmail(email: string, otp: string): Promise<void> {
        const emailSent = await emailService.sendOTP(email, {
            name: 'User',
            otp,
            expiryMinutes: 10,
        });

        if (!emailSent) {
            throw new ApiError(
                500,
                'EMAIL_SEND_FAILED',
                'Failed to send OTP email',
            );
        }
    }

    private validateOTP(wallet: any, otp: string): void {
        if (wallet.otp !== otp) {
            throw new ApiError(400, 'INVALID_OTP', 'Invalid OTP');
        }

        if (wallet.otpExpiry && wallet.otpExpiry < new Date()) {
            throw new ApiError(400, 'OTP_EXPIRED', 'OTP expired');
        }
    }

    private formatWalletData(wallet: any) {
        return {
            walletAddress: wallet.address,
            socialType: wallet.socialType,
            userData: wallet.userData,
            network: wallet.network,
        };
    }
}

export default new EmailAuthController();
