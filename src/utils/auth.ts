import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { jwt_config } from '../config';

/**
 * Generate a secure API key
 */
export function generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a hashed version of the API key for storage
 */
export function hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): number {
    return Math.floor(100000 + Math.random() * 900000);
}

/**
 * Expire the OTP after 4hours
 */
export function expireOTP(_otp: number): Date {
    const now = new Date();
    now.setHours(now.getHours() + 4);
    return now;
}

/**
 * Hash a password
 */
export function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Compare a password with a hashed password
 */
export function comparePassword(
    password: string,
    hashedPassword: string,
): boolean {
    return (
        crypto.createHash('sha256').update(password).digest('hex') ===
        hashedPassword
    );
}

/**
 * Generate a JWT token
 */
export function generateJWT(payload: any): string {
    return jwt.sign(payload, jwt_config.secret, {
        expiresIn: jwt_config.expiresIn,
    } as SignOptions);
}

/**
 * Verify a JWT token
 */
export function verifyJWT(token: string): any {
    return jwt.verify(token, jwt_config.secret);
}

/**
 * Decode a JWT token
 */
export function decodeJWT(token: string): any {
    return jwt.decode(token);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generate a client secret
 */
export function generateClientSecret(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate URLs
 */
export function validateUrls(urls: string[]): boolean {
    return urls.every(
        (url) => url.startsWith('https://') || url.startsWith('http://'),
    );
}

/**
 * Generate a unique app ID
 */
export function generateAppId(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate a 64-character hex app ID
 */
export function validateAppId(appId: string): boolean {
    return /^[a-f0-9]{64}$/.test(appId);
}

/**
 * isJwtError
 */
export function isJwtError(
    error: any,
): error is { name: string; message: string } {
    return (
        error.name &&
        (error.name === 'TokenExpiredError' ||
            error.name === 'JsonWebTokenError')
    );
}

export const validatePhoneNumber = (phoneNumber: string): boolean => {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return false;
    }

    // Basic international phone number validation
    // Allows: +1234567890, +1 (234) 567-890, +44 20 1234 5678, etc.
    const phoneRegex =
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
};
