// src/config/chains.ts
import {
    sepolia,
    mainnet,
    base,
    baseSepolia,
    optimism,
    optimismSepolia,
    arbitrum,
    arbitrumSepolia,
    polygon,
    polygonAmoy,
    avalanche,
    avalancheFuji,
    bsc,
    bscTestnet,
} from 'viem/chains';
import { ChainConfig } from '../types/signing-types';
import 'dotenv';

// Custom Lisk configuration (you'll need to add Lisk to viem or create custom config)
export const lisk = {
    id: 1135, // Lisk Mainnet
    name: 'Lisk',
    network: 'lisk',
    nativeCurrency: {
        decimals: 18,
        name: 'LSK',
        symbol: 'LSK',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.api.lisk.com'],
        },
        public: {
            http: ['https://rpc.api.lisk.com'],
        },
    },
    blockExplorers: {
        default: { name: 'LiskScan', url: 'https://liskscan.com' },
    },
} as const;

export const liskTestnet = {
    id: 4202, // Lisk Testnet
    name: 'Lisk Testnet',
    network: 'lisk-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'LSK',
        symbol: 'LSK',
    },
    rpcUrls: {
        default: {
            http: ['https://testnet.rpc.api.lisk.com'],
        },
        public: {
            http: ['https://testnet.rpc.api.lisk.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'LiskScan Testnet',
            url: 'https://testnet.liskscan.com',
        },
    },
    testnet: true,
} as const;

export const CHAINS: Record<number, ChainConfig> = {
    // Ethereum
    1: {
        chain: mainnet,
        rpcUrl:
            process.env.ETHEREUM_MAINNET_RPC_URL || 'https://eth.llamarpc.com',
        explorerUrl: 'https://etherscan.io',
        currency: 'ETH',
        testnet: false,
    },
    11155111: {
        chain: sepolia,
        rpcUrl:
            process.env.ETHEREUM_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org',
        explorerUrl: 'https://sepolia.etherscan.io',
        currency: 'ETH',
        testnet: true,
    },

    // Base
    8453: {
        chain: base,
        rpcUrl: process.env.BASE_MAINNET_RPC_URL || 'https://mainnet.base.org',
        explorerUrl: 'https://basescan.org',
        currency: 'ETH',
        testnet: false,
    },
    84532: {
        chain: baseSepolia,
        rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
        explorerUrl: 'https://sepolia.basescan.org',
        currency: 'ETH',
        testnet: true,
    },

    // Lisk
    1135: {
        chain: lisk,
        rpcUrl: process.env.LISK_MAINNET_RPC_URL || 'https://rpc.api.lisk.com',
        explorerUrl: 'https://liskscan.com',
        currency: 'LSK',
        testnet: false,
    },
    4202: {
        chain: liskTestnet,
        rpcUrl:
            process.env.LISK_TESTNET_RPC_URL ||
            'https://testnet.rpc.api.lisk.com',
        explorerUrl: 'https://testnet.liskscan.com',
        currency: 'LSK',
        testnet: true,
    },

    // Optimism
    10: {
        chain: optimism,
        rpcUrl:
            process.env.OPTIMISM_MAINNET_RPC_URL ||
            'https://mainnet.optimism.io',
        explorerUrl: 'https://optimistic.etherscan.io',
        currency: 'ETH',
        testnet: false,
    },
    11155420: {
        chain: optimismSepolia,
        rpcUrl:
            process.env.OPTIMISM_SEPOLIA_RPC_URL ||
            'https://sepolia.optimism.io',
        explorerUrl: 'https://sepolia-optimism.etherscan.io',
        currency: 'ETH',
        testnet: true,
    },

    // Arbitrum
    42161: {
        chain: arbitrum,
        rpcUrl:
            process.env.ARBITRUM_MAINNET_RPC_URL ||
            'https://arb1.arbitrum.io/rpc',
        explorerUrl: 'https://arbiscan.io',
        currency: 'ETH',
        testnet: false,
    },
    421614: {
        chain: arbitrumSepolia,
        rpcUrl:
            process.env.ARBITRUM_SEPOLIA_RPC_URL ||
            'https://sepolia-rollup.arbitrum.io/rpc',
        explorerUrl: 'https://sepolia.arbiscan.io',
        currency: 'ETH',
        testnet: true,
    },

    // Polygon
    137: {
        chain: polygon,
        rpcUrl:
            process.env.POLYGON_MAINNET_RPC_URL || 'https://polygon-rpc.com',
        explorerUrl: 'https://polygonscan.com',
        currency: 'MATIC',
        testnet: false,
    },
    80002: {
        chain: polygonAmoy,
        rpcUrl:
            process.env.POLYGON_AMOY_RPC_URL ||
            'https://rpc-amoy.polygon.technology',
        explorerUrl: 'https://amoy.polygonscan.com',
        currency: 'MATIC',
        testnet: true,
    },

    // Avalanche
    43114: {
        chain: avalanche,
        rpcUrl:
            process.env.AVALANCHE_MAINNET_RPC_URL ||
            'https://api.avax.network/ext/bc/C/rpc',
        explorerUrl: 'https://snowtrace.io',
        currency: 'AVAX',
        testnet: false,
    },
    43113: {
        chain: avalancheFuji,
        rpcUrl:
            process.env.AVALANCHE_FUJI_RPC_URL ||
            'https://api.avax-test.network/ext/bc/C/rpc',
        explorerUrl: 'https://testnet.snowtrace.io',
        currency: 'AVAX',
        testnet: true,
    },

    // BSC
    56: {
        chain: bsc,
        rpcUrl:
            process.env.BSC_MAINNET_RPC_URL ||
            'https://bsc-dataseed.binance.org',
        explorerUrl: 'https://bscscan.com',
        currency: 'BNB',
        testnet: false,
    },
    97: {
        chain: bscTestnet,
        rpcUrl:
            process.env.BSC_TESTNET_RPC_URL ||
            'https://data-seed-prebsc-1-s1.binance.org:8545',
        explorerUrl: 'https://testnet.bscscan.com',
        currency: 'BNB',
        testnet: true,
    },
};

export const SUPPORTED_CHAINS = Object.values(CHAINS).map((config) => ({
    chainId: config.chain.id,
    name: config.chain.name,
    testnet: config.testnet,
    currency: config.currency,
    explorerUrl: config.explorerUrl,
}));

export function getChainConfig(chainId: number): ChainConfig {
    const config = CHAINS[chainId];
    if (!config) {
        throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    return config;
}
