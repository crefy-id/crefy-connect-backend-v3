import { Router } from 'express';
import balanceController from '../controllers/balance-controller';
import { authenticateToken } from '../middleware/auth-middleware';

const router: Router = Router();

/**
 * @route   GET /api/balance/chains
 * @desc    Get all supported chains for balance checking
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @returns {Object} List of supported chains
 */
router.get('/chains', authenticateToken, (req, res, next) => {
    balanceController
        .getSupportedChains()
        .then((result) => res.json(result))
        .catch(next);
});

/**
 * @route   GET /api/balance/native
 * @desc    Get native balance for a wallet address on a specific chain
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @query   {string} walletAddress - Wallet address (required)
 * @query   {number} [chainId] - Chain ID (optional, defaults to 8453 for Base)
 * @returns {Object} Native balance with chain info
 */
router.get('/native', authenticateToken, (req, res, next) => {
    const { walletAddress, chainId } = req.query;
    
    // Parse chainId to number if provided
    const chainIdNumber = chainId ? parseInt(chainId as string, 10) : undefined;
    
    balanceController
        .getBalance(walletAddress as string, chainIdNumber)
        .then((result) => res.json(result))
        .catch(next);
});

/**
 * @route   GET /api/balance/balances
 * @desc    Get native balances across multiple chains
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @query   {string} walletAddress - Wallet address (required)
 * @query   {string} [chainIds] - Comma-separated chain IDs (optional, defaults to all supported chains)
 * @returns {Object} Native balances across specified chains
 */
router.get('/balances', authenticateToken, (req, res, next) => {
    const { walletAddress, chainIds } = req.query;
    
    balanceController
        .getBalances(walletAddress as string, chainIds as string)
        .then((result) => res.json(result))
        .catch(next);
});

export default router;