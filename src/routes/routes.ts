/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TransactionController } from './../controllers/transaction-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SmsAuthController } from './../controllers/sms-auth-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SigningController } from './../controllers/signing-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ENSSubnameController } from './../controllers/ens-subname-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EmailAuthController } from './../controllers/email-auth-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BalanceController } from './../controllers/balance-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/auth-controller';
import { expressAuthentication } from './../authentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "SendTransactionResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "transactionHash": {"dataType":"string"},
            "fromAddress": {"dataType":"string","required":true},
            "toAddress": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
            "chainId": {"dataType":"double","required":true},
            "chainName": {"dataType":"string","required":true},
            "tokenAddress": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "error": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SendTransactionRequest": {
        "dataType": "refObject",
        "properties": {
            "fromAddress": {"dataType":"string","required":true},
            "toAddress": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
            "chainId": {"dataType":"double","required":true},
            "tokenAddress": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "gasLimit": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "maxFeePerGas": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "maxPriorityFeePerGas": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "nonce": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenTransfer": {
        "dataType": "refObject",
        "properties": {
            "tokenAddress": {"dataType":"string","required":true},
            "from": {"dataType":"string","required":true},
            "to": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
            "tokenSymbol": {"dataType":"string","required":true},
            "tokenDecimals": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Transaction": {
        "dataType": "refObject",
        "properties": {
            "hash": {"dataType":"string","required":true},
            "from": {"dataType":"string","required":true},
            "to": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
            "timestamp": {"dataType":"double","required":true},
            "blockNumber": {"dataType":"double","required":true},
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["failed"]},{"dataType":"enum","enums":["pending"]}],"required":true},
            "gasUsed": {"dataType":"string","required":true},
            "gasPrice": {"dataType":"string","required":true},
            "tokenTransfers": {"dataType":"array","array":{"dataType":"refObject","ref":"TokenTransfer"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionHistoryResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "transactions": {"dataType":"array","array":{"dataType":"refObject","ref":"Transaction"},"required":true},
            "walletAddress": {"dataType":"string","required":true},
            "chainId": {"dataType":"double","required":true},
            "chainName": {"dataType":"string","required":true},
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "total": {"dataType":"double","required":true},
            "error": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionHistoryRequest": {
        "dataType": "refObject",
        "properties": {
            "walletAddress": {"dataType":"string","required":true},
            "chainId": {"dataType":"double","required":true},
            "page": {"dataType":"double"},
            "limit": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GasPriceResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "gasPrice": {"dataType":"string"},
            "maxFeePerGas": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "maxPriorityFeePerGas": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "chainId": {"dataType":"double","required":true},
            "chainName": {"dataType":"string","required":true},
            "error": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionStatusResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "transactionHash": {"dataType":"string","required":true},
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["failed"]},{"dataType":"enum","enums":["pending"]}],"required":true},
            "blockNumber": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"undefined"}]},
            "confirmations": {"dataType":"double","required":true},
            "gasUsed": {"dataType":"string"},
            "error": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlockchainNetwork": {
        "dataType": "refEnum",
        "enums": ["evm","stellar","solana"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SmsLoginResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "isActive": {"dataType":"boolean"},
            "walletExists": {"dataType":"boolean"},
            "network": {"ref":"BlockchainNetwork"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SmsLoginRequest": {
        "dataType": "refObject",
        "properties": {
            "phoneNumber": {"dataType":"string","required":true},
            "network": {"ref":"BlockchainNetwork"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifySmsOTPResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"network":{"ref":"BlockchainNetwork","required":true},"userData":{"dataType":"string","required":true},"socialType":{"dataType":"string","required":true},"walletAddress":{"dataType":"string","required":true}}},
            "isActive": {"dataType":"boolean"},
            "token": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifySmsOTPRequest": {
        "dataType": "refObject",
        "properties": {
            "phoneNumber": {"dataType":"string","required":true},
            "otp": {"dataType":"string","required":true},
            "network": {"ref":"BlockchainNetwork"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResendSmsOTPResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResendSmsOTPRequest": {
        "dataType": "refObject",
        "properties": {
            "phoneNumber": {"dataType":"string","required":true},
            "network": {"ref":"BlockchainNetwork"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChainInfoResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "chains": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"rpcUrl":{"dataType":"string","required":true},"explorerUrl":{"dataType":"string","required":true},"currency":{"dataType":"string","required":true},"testnet":{"dataType":"boolean","required":true},"name":{"dataType":"string","required":true},"chainId":{"dataType":"double","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SigningResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "signature": {"dataType":"string"},
            "signedTransaction": {"dataType":"string"},
            "error": {"dataType":"string"},
            "chainId": {"dataType":"double"},
            "chainName": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignMessageRequest": {
        "dataType": "refObject",
        "properties": {
            "chainId": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignTransactionRequest": {
        "dataType": "refObject",
        "properties": {
            "chainId": {"dataType":"double","required":true},
            "to": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
            "data": {"dataType":"string"},
            "gasLimit": {"dataType":"string","required":true},
            "gasPrice": {"dataType":"string"},
            "maxFeePerGas": {"dataType":"string"},
            "maxPriorityFeePerGas": {"dataType":"string"},
            "nonce": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TypedDataDomain": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "version": {"dataType":"string"},
            "chainId": {"dataType":"double"},
            "verifyingContract": {"dataType":"string"},
            "salt": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TypedDataField": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.TypedDataField-Array_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"array","array":{"dataType":"refObject","ref":"TypedDataField"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.any_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignTypedDataRequest": {
        "dataType": "refObject",
        "properties": {
            "chainId": {"dataType":"double","required":true},
            "domain": {"ref":"TypedDataDomain","required":true},
            "types": {"ref":"Record_string.TypedDataField-Array_","required":true},
            "primaryType": {"dataType":"string","required":true},
            "message": {"ref":"Record_string.any_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SendSignedTransactionRequest": {
        "dataType": "refObject",
        "properties": {
            "chainId": {"dataType":"double","required":true},
            "signedTransaction": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyMessageRequest": {
        "dataType": "refObject",
        "properties": {
            "chainId": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
            "signature": {"dataType":"string","required":true},
            "address": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CheckSubnameResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "isClaimed": {"dataType":"boolean","required":true},
            "owner": {"dataType":"string"},
            "node": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CheckSubnameRequest": {
        "dataType": "refObject",
        "properties": {
            "label": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClaimSubnameResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "node": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "transactionHash": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClaimSubnameRequest": {
        "dataType": "refObject",
        "properties": {
            "label": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserSubnamesResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "subnames": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AllSubnamesResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "subnames": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ServiceStatusResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "connected": {"dataType":"boolean","required":true},
            "contractOwner": {"dataType":"string","required":true},
            "parentNode": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EmailLoginResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "isActive": {"dataType":"boolean"},
            "walletExists": {"dataType":"boolean"},
            "network": {"ref":"BlockchainNetwork"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EmailLoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "network": {"ref":"BlockchainNetwork"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyOTPResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"network":{"ref":"BlockchainNetwork","required":true},"userData":{"dataType":"string","required":true},"socialType":{"dataType":"string","required":true},"walletAddress":{"dataType":"string","required":true}}},
            "isActive": {"dataType":"boolean"},
            "token": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyOTPRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "otp": {"dataType":"string","required":true},
            "network": {"ref":"BlockchainNetwork"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResendOTPResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResendOTPRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "network": {"ref":"BlockchainNetwork"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NativeCurrency": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "symbol": {"dataType":"string","required":true},
            "decimals": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SupportedChainsResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "chains": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"nativeCurrency":{"ref":"NativeCurrency","required":true},"rpcUrl":{"dataType":"string","required":true},"explorerUrl":{"dataType":"string","required":true},"currency":{"dataType":"string","required":true},"testnet":{"dataType":"boolean","required":true},"name":{"dataType":"string","required":true},"chainId":{"dataType":"double","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NativeBalanceResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "balance": {"dataType":"string","required":true},
            "error": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NativeBalanceRequest": {
        "dataType": "refObject",
        "properties": {
            "walletAddress": {"dataType":"string","required":true},
            "chainId": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenBalance": {
        "dataType": "refObject",
        "properties": {
            "symbol": {"dataType":"string","required":true},
            "balance": {"dataType":"string","required":true},
            "formattedBalance": {"dataType":"string","required":true},
            "decimals": {"dataType":"double","required":true},
            "tokenAddress": {"dataType":"string","required":true},
            "isNative": {"dataType":"boolean","required":true},
            "name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenBalanceResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "tokenBalance": {"dataType":"union","subSchemas":[{"ref":"TokenBalance"},{"dataType":"undefined"}]},
            "error": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BalanceResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "walletAddress": {"dataType":"string","required":true},
            "nativeBalance": {"dataType":"string","required":true},
            "tokenBalances": {"dataType":"array","array":{"dataType":"refObject","ref":"TokenBalance"},"required":true},
            "totalValueUSD": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "chainId": {"dataType":"double","required":true},
            "chainName": {"dataType":"string","required":true},
            "error": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BalanceRequest": {
        "dataType": "refObject",
        "properties": {
            "walletAddress": {"dataType":"string","required":true},
            "tokenAddress": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "chainId": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MultipleTokensResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "walletAddress": {"dataType":"string","required":true},
            "tokenBalances": {"dataType":"array","array":{"dataType":"refObject","ref":"TokenBalance"},"required":true},
            "chainId": {"dataType":"double","required":true},
            "chainName": {"dataType":"string","required":true},
            "error": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MultipleTokensRequest": {
        "dataType": "refObject",
        "properties": {
            "walletAddress": {"dataType":"string","required":true},
            "tokenAddresses": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "chainId": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"undefined"}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WalletResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"wallet":{"dataType":"nestedObjectLiteral","nestedProperties":{"isActive":{"dataType":"boolean","required":true},"userData":{"dataType":"string","required":true},"address":{"dataType":"string","required":true},"socialType":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsTransactionController_sendTransaction: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"SendTransactionRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/transactions/send',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.sendTransaction)),

            async function TransactionController_sendTransaction(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_sendTransaction, request, response });

                const controller = new TransactionController();

              await templateService.apiHandler({
                methodName: 'sendTransaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransactionController_getTransactionHistory: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"TransactionHistoryRequest"},
        };
        app.post('/transactions/history',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.getTransactionHistory)),

            async function TransactionController_getTransactionHistory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_getTransactionHistory, request, response });

                const controller = new TransactionController();

              await templateService.apiHandler({
                methodName: 'getTransactionHistory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransactionController_getGasPrices: Record<string, TsoaRoute.ParameterSchema> = {
                chainId: {"in":"query","name":"chainId","required":true,"dataType":"string"},
        };
        app.get('/transactions/gas-prices',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.getGasPrices)),

            async function TransactionController_getGasPrices(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_getGasPrices, request, response });

                const controller = new TransactionController();

              await templateService.apiHandler({
                methodName: 'getGasPrices',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransactionController_getTransactionStatus: Record<string, TsoaRoute.ParameterSchema> = {
                chainId: {"in":"query","name":"chainId","required":true,"dataType":"string"},
                transactionHash: {"in":"query","name":"transactionHash","required":true,"dataType":"string"},
        };
        app.get('/transactions/status',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.getTransactionStatus)),

            async function TransactionController_getTransactionStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_getTransactionStatus, request, response });

                const controller = new TransactionController();

              await templateService.apiHandler({
                methodName: 'getTransactionStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransactionController_estimateGas: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"SendTransactionRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/transactions/estimate-gas',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.estimateGas)),

            async function TransactionController_estimateGas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_estimateGas, request, response });

                const controller = new TransactionController();

              await templateService.apiHandler({
                methodName: 'estimateGas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSmsAuthController_smsLogin: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"SmsLoginRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/auth/sms/login',
            authenticateMiddleware([{"app":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SmsAuthController)),
            ...(fetchMiddlewares<RequestHandler>(SmsAuthController.prototype.smsLogin)),

            async function SmsAuthController_smsLogin(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSmsAuthController_smsLogin, request, response });

                const controller = new SmsAuthController();

              await templateService.apiHandler({
                methodName: 'smsLogin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSmsAuthController_verifySmsOTP: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"VerifySmsOTPRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/auth/sms/verify',
            authenticateMiddleware([{"app":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SmsAuthController)),
            ...(fetchMiddlewares<RequestHandler>(SmsAuthController.prototype.verifySmsOTP)),

            async function SmsAuthController_verifySmsOTP(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSmsAuthController_verifySmsOTP, request, response });

                const controller = new SmsAuthController();

              await templateService.apiHandler({
                methodName: 'verifySmsOTP',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSmsAuthController_resendSmsOTP: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ResendSmsOTPRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/auth/sms/resend-otp',
            authenticateMiddleware([{"app":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SmsAuthController)),
            ...(fetchMiddlewares<RequestHandler>(SmsAuthController.prototype.resendSmsOTP)),

            async function SmsAuthController_resendSmsOTP(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSmsAuthController_resendSmsOTP, request, response });

                const controller = new SmsAuthController();

              await templateService.apiHandler({
                methodName: 'resendSmsOTP',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSigningController_getSupportedChains: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/signing/chains',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SigningController)),
            ...(fetchMiddlewares<RequestHandler>(SigningController.prototype.getSupportedChains)),

            async function SigningController_getSupportedChains(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSigningController_getSupportedChains, request, response });

                const controller = new SigningController();

              await templateService.apiHandler({
                methodName: 'getSupportedChains',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSigningController_getChainInfo: Record<string, TsoaRoute.ParameterSchema> = {
                chainId: {"in":"query","name":"chainId","required":true,"dataType":"string"},
        };
        app.get('/signing/chain-info',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SigningController)),
            ...(fetchMiddlewares<RequestHandler>(SigningController.prototype.getChainInfo)),

            async function SigningController_getChainInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSigningController_getChainInfo, request, response });

                const controller = new SigningController();

              await templateService.apiHandler({
                methodName: 'getChainInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSigningController_signMessage: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"SignMessageRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/signing/sign-message',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SigningController)),
            ...(fetchMiddlewares<RequestHandler>(SigningController.prototype.signMessage)),

            async function SigningController_signMessage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSigningController_signMessage, request, response });

                const controller = new SigningController();

              await templateService.apiHandler({
                methodName: 'signMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSigningController_signTransaction: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"SignTransactionRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/signing/sign-transaction',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SigningController)),
            ...(fetchMiddlewares<RequestHandler>(SigningController.prototype.signTransaction)),

            async function SigningController_signTransaction(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSigningController_signTransaction, request, response });

                const controller = new SigningController();

              await templateService.apiHandler({
                methodName: 'signTransaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSigningController_signTypedData: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"SignTypedDataRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/signing/sign-typed-data',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SigningController)),
            ...(fetchMiddlewares<RequestHandler>(SigningController.prototype.signTypedData)),

            async function SigningController_signTypedData(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSigningController_signTypedData, request, response });

                const controller = new SigningController();

              await templateService.apiHandler({
                methodName: 'signTypedData',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSigningController_sendSignedTransaction: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"SendSignedTransactionRequest"},
        };
        app.post('/signing/send-signed-transaction',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SigningController)),
            ...(fetchMiddlewares<RequestHandler>(SigningController.prototype.sendSignedTransaction)),

            async function SigningController_sendSignedTransaction(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSigningController_sendSignedTransaction, request, response });

                const controller = new SigningController();

              await templateService.apiHandler({
                methodName: 'sendSignedTransaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSigningController_verifyMessage: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"VerifyMessageRequest"},
        };
        app.post('/signing/verify-message',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SigningController)),
            ...(fetchMiddlewares<RequestHandler>(SigningController.prototype.verifyMessage)),

            async function SigningController_verifyMessage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSigningController_verifyMessage, request, response });

                const controller = new SigningController();

              await templateService.apiHandler({
                methodName: 'verifyMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsENSSubnameController_checkSubname: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CheckSubnameRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/ens/subnames/check',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController)),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController.prototype.checkSubname)),

            async function ENSSubnameController_checkSubname(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsENSSubnameController_checkSubname, request, response });

                const controller = new ENSSubnameController();

              await templateService.apiHandler({
                methodName: 'checkSubname',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsENSSubnameController_claimSubname: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ClaimSubnameRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/ens/subnames/claim',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController)),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController.prototype.claimSubname)),

            async function ENSSubnameController_claimSubname(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsENSSubnameController_claimSubname, request, response });

                const controller = new ENSSubnameController();

              await templateService.apiHandler({
                methodName: 'claimSubname',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsENSSubnameController_getUserSubnames: Record<string, TsoaRoute.ParameterSchema> = {
                userAddress: {"in":"query","name":"userAddress","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/ens/subnames/user',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController)),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController.prototype.getUserSubnames)),

            async function ENSSubnameController_getUserSubnames(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsENSSubnameController_getUserSubnames, request, response });

                const controller = new ENSSubnameController();

              await templateService.apiHandler({
                methodName: 'getUserSubnames',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsENSSubnameController_getAllSubnames: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/ens/subnames/all',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController)),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController.prototype.getAllSubnames)),

            async function ENSSubnameController_getAllSubnames(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsENSSubnameController_getAllSubnames, request, response });

                const controller = new ENSSubnameController();

              await templateService.apiHandler({
                methodName: 'getAllSubnames',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsENSSubnameController_getServiceStatus: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/ens/subnames/status',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController)),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController.prototype.getServiceStatus)),

            async function ENSSubnameController_getServiceStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsENSSubnameController_getServiceStatus, request, response });

                const controller = new ENSSubnameController();

              await templateService.apiHandler({
                methodName: 'getServiceStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsENSSubnameController_hasUserClaimedSubname: Record<string, TsoaRoute.ParameterSchema> = {
                userAddress: {"in":"query","name":"userAddress","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/ens/subnames/has-claimed',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController)),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController.prototype.hasUserClaimedSubname)),

            async function ENSSubnameController_hasUserClaimedSubname(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsENSSubnameController_hasUserClaimedSubname, request, response });

                const controller = new ENSSubnameController();

              await templateService.apiHandler({
                methodName: 'hasUserClaimedSubname',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsENSSubnameController_getNetworkInfo: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/ens/subnames/network-info',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController)),
            ...(fetchMiddlewares<RequestHandler>(ENSSubnameController.prototype.getNetworkInfo)),

            async function ENSSubnameController_getNetworkInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsENSSubnameController_getNetworkInfo, request, response });

                const controller = new ENSSubnameController();

              await templateService.apiHandler({
                methodName: 'getNetworkInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEmailAuthController_emailLogin: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"EmailLoginRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/auth/email/login',
            authenticateMiddleware([{"app":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EmailAuthController)),
            ...(fetchMiddlewares<RequestHandler>(EmailAuthController.prototype.emailLogin)),

            async function EmailAuthController_emailLogin(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEmailAuthController_emailLogin, request, response });

                const controller = new EmailAuthController();

              await templateService.apiHandler({
                methodName: 'emailLogin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEmailAuthController_verifyOTP: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"VerifyOTPRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/auth/email/verify',
            authenticateMiddleware([{"app":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EmailAuthController)),
            ...(fetchMiddlewares<RequestHandler>(EmailAuthController.prototype.verifyOTP)),

            async function EmailAuthController_verifyOTP(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEmailAuthController_verifyOTP, request, response });

                const controller = new EmailAuthController();

              await templateService.apiHandler({
                methodName: 'verifyOTP',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEmailAuthController_resendOTP: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ResendOTPRequest"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/auth/email/resend-otp',
            authenticateMiddleware([{"app":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EmailAuthController)),
            ...(fetchMiddlewares<RequestHandler>(EmailAuthController.prototype.resendOTP)),

            async function EmailAuthController_resendOTP(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEmailAuthController_resendOTP, request, response });

                const controller = new EmailAuthController();

              await templateService.apiHandler({
                methodName: 'resendOTP',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBalanceController_getSupportedChains: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/balance/chains',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BalanceController)),
            ...(fetchMiddlewares<RequestHandler>(BalanceController.prototype.getSupportedChains)),

            async function BalanceController_getSupportedChains(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBalanceController_getSupportedChains, request, response });

                const controller = new BalanceController();

              await templateService.apiHandler({
                methodName: 'getSupportedChains',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBalanceController_getNativeBalance: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"NativeBalanceRequest"},
        };
        app.post('/balance/native',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BalanceController)),
            ...(fetchMiddlewares<RequestHandler>(BalanceController.prototype.getNativeBalance)),

            async function BalanceController_getNativeBalance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBalanceController_getNativeBalance, request, response });

                const controller = new BalanceController();

              await templateService.apiHandler({
                methodName: 'getNativeBalance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBalanceController_getTokenBalance: Record<string, TsoaRoute.ParameterSchema> = {
                walletAddress: {"in":"query","name":"walletAddress","required":true,"dataType":"string"},
                tokenAddress: {"in":"query","name":"tokenAddress","required":true,"dataType":"string"},
                chainId: {"in":"query","name":"chainId","dataType":"string"},
        };
        app.post('/balance/token',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BalanceController)),
            ...(fetchMiddlewares<RequestHandler>(BalanceController.prototype.getTokenBalance)),

            async function BalanceController_getTokenBalance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBalanceController_getTokenBalance, request, response });

                const controller = new BalanceController();

              await templateService.apiHandler({
                methodName: 'getTokenBalance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBalanceController_getBalances: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"BalanceRequest"},
        };
        app.post('/balance/all',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BalanceController)),
            ...(fetchMiddlewares<RequestHandler>(BalanceController.prototype.getBalances)),

            async function BalanceController_getBalances(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBalanceController_getBalances, request, response });

                const controller = new BalanceController();

              await templateService.apiHandler({
                methodName: 'getBalances',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBalanceController_getMultipleTokenBalances: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"MultipleTokensRequest"},
        };
        app.post('/balance/multiple-tokens',
            authenticateMiddleware([{"app":[]},{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BalanceController)),
            ...(fetchMiddlewares<RequestHandler>(BalanceController.prototype.getMultipleTokenBalances)),

            async function BalanceController_getMultipleTokenBalances(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBalanceController_getMultipleTokenBalances, request, response });

                const controller = new BalanceController();

              await templateService.apiHandler({
                methodName: 'getMultipleTokenBalances',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_getWalletInfo: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/auth/wallet-info',
            authenticateMiddleware([{"bearer":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getWalletInfo)),

            async function AuthController_getWalletInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_getWalletInfo, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'getWalletInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
