// src/controllers/sms-auth-controller.ts
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
    validatePhoneNumber,
} from '../utils/auth';
import walletService, { BlockchainNetwork } from '../services/wallet-service';
import { createSmsService, SmsServiceConfig } from '../services/sms-service';
import { smtp_config } from '../config';

// Request interfaces
interface SmsLoginRequest {
    phoneNumber: string;
    network?: BlockchainNetwork;
}

interface VerifySmsOTPRequest {
    phoneNumber: string;
    otp: string;
    network?: BlockchainNetwork;
}

interface ResendSmsOTPRequest {
    phoneNumber: string;
    network?: BlockchainNetwork;
}

// Response interfaces
interface SmsLoginResponse {
    success: boolean;
    message: string;
    isActive?: boolean;
    walletExists?: boolean;
    network?: BlockchainNetwork;
}

interface VerifySmsOTPResponse {
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

interface ResendSmsOTPResponse {
    success: boolean;
    message: string;
}

@Route('auth/sms')
@Tags('SMS Authentication')
@Security('app')
export class SmsAuthController extends Controller {
    private smsService;

    constructor() {
        super();
        // Initialize SMS service
        const smsConfig: SmsServiceConfig = {
            apiKey: process.env.SMS_API_KEY || 'your-sms-api-key',
            baseUrl:
                process.env.SMS_BASE_URL ||
                'https://kbzktzsczpwsttjmfnge.supabase.co/functions/v1/send-message',
            timeout: parseInt(process.env.SMS_TIMEOUT || '10000'),
            maxRetries: parseInt(process.env.SMS_MAX_RETRIES || '3'),
            retryDelay: parseInt(process.env.SMS_RETRY_DELAY || '1000'),
        };
        this.smsService = createSmsService(smsConfig);
    }

    /**
     * Login or register with phone number
     * Sends OTP via SMS for verification
     * @example requestBody {"phoneNumber": "+1234567890", "network": "stellar"}
     */
    @Post('login')
    @SuccessResponse('200', 'OTP sent successfully')
    @Example<SmsLoginResponse>({
        success: true,
        message: 'OTP sent to phone number for verification',
        isActive: false,
        walletExists: false,
        network: BlockchainNetwork.STELLAR,
    })
    @Security('app')
    public async smsLogin(
        @Body() body: SmsLoginRequest,
        @Request() request: ExpressRequest,
    ): Promise<SmsLoginResponse> {
        const { app } = (request as any).user;
        const { phoneNumber, network = BlockchainNetwork.EVM } = body;
        const token = request.header('Authorization')?.replace('Bearer ', '');

        this.validatePhoneInput(phoneNumber);

        const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
        const existingWallet = await this.findWalletByPhoneAndNetwork(
            normalizedPhone,
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
                normalizedPhone,
            );
            return {
                success: true,
                message: 'OTP sent to phone number for verification',
                isActive: existingWallet.isActive,
                walletExists: true,
                network: network,
            };
        }

        await this.handleNewWallet(
            normalizedPhone,
            app.appId,
            otp,
            otpExpiry,
            network,
        );
        return {
            success: true,
            message: 'OTP sent to phone number for verification',
            isActive: false,
            walletExists: false,
            network: network,
        };
    }

    /**
     * Verify SMS OTP and activate wallet
     * @example requestBody {"phoneNumber": "+1234567890", "otp": "123456", "network": "stellar"}
     */
    @Post('verify')
    @SuccessResponse('200', 'Wallet verified successfully')
    @Example<VerifySmsOTPResponse>({
        success: true,
        message: 'Wallet verified successfully',
        data: {
            walletAddress: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEF',
            socialType: 'sms',
            userData:
                '{"phoneNumber":"+1234567890","network":"stellar","secret":"S..."}',
            network: BlockchainNetwork.STELLAR,
        },
        isActive: true,
        token: 'jwt-token-here',
    })
    @Security('app')
    public async verifySmsOTP(
        @Body() body: VerifySmsOTPRequest,
        @Request() request: ExpressRequest,
    ): Promise<VerifySmsOTPResponse> {
        const { app } = (request as any).user;
        const { phoneNumber, otp, network = BlockchainNetwork.EVM } = body;

        this.validatePhoneInput(phoneNumber);

        const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
        const wallet = await this.findWalletByPhoneAndNetwork(
            normalizedPhone,
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
            network: wallet.network,
        });

        // Send welcome SMS
        await this.sendWelcomeSMS(normalizedPhone);

        return {
            success: true,
            message: 'Wallet verified successfully',
            data: this.formatWalletData(wallet),
            isActive: true,
            token: newToken,
        };
    }

    /**
     * Resend OTP via SMS
     * @example requestBody {"phoneNumber": "+1234567890", "network": "stellar"}
     */
    @Post('resend-otp')
    @SuccessResponse('200', 'OTP resent successfully')
    @Example<ResendSmsOTPResponse>({
        success: true,
        message: 'OTP resent to phone number for verification',
    })
    @Security('app')
    public async resendSmsOTP(
        @Body() body: ResendSmsOTPRequest,
        @Request() request: ExpressRequest,
    ): Promise<ResendSmsOTPResponse> {
        const { app } = (request as any).user;
        const { phoneNumber, network = BlockchainNetwork.EVM } = body;

        this.validatePhoneInput(phoneNumber);

        const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
        const wallet = await this.findWalletByPhoneAndNetwork(
            normalizedPhone,
            app.appId,
            network,
        );

        if (!wallet) {
            throw new ApiError(404, 'WALLET_NOT_FOUND', 'Wallet not found');
        }

        const otp = generateOTP();
        const otpExpiry = expireOTP(otp);

        await this.updateWalletOTP(wallet, otp, otpExpiry);
        await this.sendOTPSMS(normalizedPhone, otp.toString());

        return {
            success: true,
            message: 'OTP resent to phone number for verification',
        };
    }

    // Private helper methods

    private validatePhoneInput(phoneNumber: string): void {
        if (!validatePhoneNumber(phoneNumber)) {
            throw new ApiError(
                400,
                'VALIDATION_ERROR',
                'Valid phone number in international format is required (e.g., +1234567890)',
            );
        }
    }

    private normalizePhoneNumber(phoneNumber: string): string {
        // Remove any spaces, dashes, parentheses, etc.
        const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

        // Ensure it starts with +
        if (!cleaned.startsWith('+')) {
            return `+${cleaned}`;
        }

        return cleaned;
    }

    private async findWalletByPhoneAndNetwork(
        phoneNumber: string,
        appId: string,
        network: BlockchainNetwork = BlockchainNetwork.EVM,
    ) {
        return await Wallet.findOne({
            phoneNumber,
            socialType: 'sms',
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
        phoneNumber: string,
    ): Promise<void> {
        await this.updateWalletOTP(wallet, otp, otpExpiry);
        await this.sendOTPSMS(phoneNumber, otp.toString());
    }

    private async handleNewWallet(
        phoneNumber: string,
        appId: string,
        otp: number,
        otpExpiry: Date,
        network: BlockchainNetwork = BlockchainNetwork.EVM,
    ): Promise<void> {
        const walletInfo = await walletService.generateWallet(network);
        const encryptionSalt = crypto.randomBytes(16).toString('hex');

        // Prepare userData based on network
        const userData: any = {
            phoneNumber,
            network,
        };

        // Add network-specific data
        if (network === BlockchainNetwork.STELLAR && walletInfo.secret) {
            userData.secret = walletInfo.secret;
        }

        await Wallet.create({
            appId,
            phoneNumber,
            socialType: 'sms',
            address: walletInfo.address,
            publicKey: walletInfo.publicKey,
            encryptedPrivateKey: walletInfo.privateKey,
            encryptionSalt,
            userData: JSON.stringify(userData),
            isActive: false,
            otp: otp.toString(),
            otpExpiry,
            network,
        });

        await this.sendOTPSMS(phoneNumber, otp.toString());
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

    private async sendOTPSMS(phoneNumber: string, otp: string): Promise<void> {
        // Customize OTP message based on configuration
        const smsResult = await this.smsService.sendOTP(phoneNumber, otp, 10);

        if (!smsResult.success) {
            console.error(
                'SMS send failed:',
                smsResult.error,
                smsResult.details,
            );
            throw new ApiError(
                500,
                'SMS_SEND_FAILED',
                `Failed to send OTP SMS: ${smsResult.error}`,
            );
        }

        console.log(`✅ OTP SMS sent to: ${phoneNumber}`);
    }

    private async sendWelcomeSMS(phoneNumber: string): Promise<void> {
        try {
            const smsResult = await this.smsService.sendWelcomeMessage(
                phoneNumber,
            );

            if (!smsResult.success) {
                console.warn('Welcome SMS failed to send:', smsResult.error);
                // Don't throw error for welcome message failure
            } else {
                console.log(`✅ Welcome SMS sent to: ${phoneNumber}`);
            }
        } catch (error) {
            console.warn('Failed to send welcome SMS:', error);
            // Don't throw error for welcome message failure
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

export default new SmsAuthController();
