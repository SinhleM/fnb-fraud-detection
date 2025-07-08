/**
 * Calculates a fraud risk score for a user based on their transactions.
 * @param {Array} userTransactions - A list of transactions for a single user.
 * @param {Array} allTransactions - All transactions to establish a baseline.
 * @returns {Object} - An object containing the score and risk level.
 */
export const calculateRiskScore = (userTransactions, allTransactions) => {
    // Defensive check and warning
    if (!Array.isArray(userTransactions) || userTransactions.length === 0) {
        console.warn('No transactions for user or invalid format:', userTransactions);
        return { score: 0, level: 'Low' };
    }

    // Metric 1: Fraud Ratio
    // Convert is_fraud to number in case it's a string
    const fraudulentTxns = userTransactions.filter(tx => Number(tx.is_fraud) === 1).length;
    const totalTxns = userTransactions.length;
    const fraudRatio = totalTxns > 0 ? (fraudulentTxns / totalTxns) : 0;

    // Metric 2: Transaction Volume Spike
    // Average transactions per user
    const uniqueUserCount = new Set(allTransactions.map(tx => String(tx.user_id).trim())).size;
    const avgTxnsPerUser = uniqueUserCount > 0 ? allTransactions.length / uniqueUserCount : 0;

    // Simple spike detection: user's transaction count > 3 times average
    const volumeSpike = totalTxns > avgTxnsPerUser * 3 ? 1 : 0;

    // Weighted risk score (max 100)
    const score = Math.min(fraudRatio * 70 + volumeSpike * 30, 100);

    // Risk level determination
    let level = 'Low';
    if (score > 70) {
        level = 'High';
    } else if (score > 40) {
        level = 'Medium';
    }

    return {
        score: Math.round(score),
        level,
    };
};