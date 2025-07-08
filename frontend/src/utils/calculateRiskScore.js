// src/utils/calculateRiskScore.js (Updated with Tunable Parameters)

/**
 * Calculates a fraud risk score for a user based on their transactions.
 * @param {Array} userTransactions - A list of transactions for a single user.
 * @param {Array} allTransactions - All transactions to establish a baseline.
 * @returns {Object} - An object containing the score and risk level.
 */
export const calculateRiskScore = (userTransactions, allTransactions) => {
    // Tunable parameters for risk score calculation
    const FRAUD_RATIO_WEIGHT = 75; // Increased weight for fraud ratio
    const VOLUME_SPIKE_WEIGHT = 25; // Adjusted weight for volume spike
    const VOLUME_SPIKE_MULTIPLIER = 4; // Changed from 3 to 4 for a slightly higher threshold
    
    // Tunable parameters for risk levels
    const LOW_RISK_THRESHOLD = 30; // 'Medium' starts above this
    const HIGH_RISK_THRESHOLD = 60; // 'High' starts above this

    if (!Array.isArray(userTransactions) || userTransactions.length === 0) {
        console.warn('No transactions for user or invalid format:', userTransactions);
        return { score: 0, level: 'Low' };
    }

    // Metric 1: Fraud Ratio
    const fraudulentTxns = userTransactions.filter(tx => Number(tx.is_fraud) === 1).length;
    const totalTxns = userTransactions.length;
    const fraudRatio = totalTxns > 0 ? (fraudulentTxns / totalTxns) : 0;

    // Metric 2: Transaction Volume Spike
    const uniqueUserCount = new Set(allTransactions.map(tx => String(tx.user_id).trim())).size;
    const avgTxnsPerUser = uniqueUserCount > 0 ? allTransactions.length / uniqueUserCount : 0;

    const volumeSpike = totalTxns > avgTxnsPerUser * VOLUME_SPIKE_MULTIPLIER ? 1 : 0; // Use configurable multiplier

    // Weighted risk score (max 100)
    const score = Math.min(fraudRatio * FRAUD_RATIO_WEIGHT + volumeSpike * VOLUME_SPIKE_WEIGHT, 100);

    // Risk level determination using configurable thresholds
    let level = 'Low';
    if (score > HIGH_RISK_THRESHOLD) {
        level = 'High';
    } else if (score > LOW_RISK_THRESHOLD) {
        level = 'Medium';
    }

    return {
        score: Math.round(score),
        level,
    };
};