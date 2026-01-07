import { Keypair } from '@stellar/stellar-sdk';

export class StellarWalletGenerator {
    /**
     * Generate a single random wallet
     */
    static generateRandomWallet(): {
        publicKey: string;
        secret: string;
    } {
        const keypair = Keypair.random();

        return {
            publicKey: keypair.publicKey(),
            secret: keypair.secret(),
        };
    }

    /**
     * Generate wallet from secret key
     */
    static fromSecret(secret: string): {
        publicKey: string;
        secret: string;
    } {
        const keypair = Keypair.fromSecret(secret);

        return {
            publicKey: keypair.publicKey(),
            secret: secret,
        };
    }
}
