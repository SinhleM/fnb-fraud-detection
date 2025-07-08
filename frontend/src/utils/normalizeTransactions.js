export const normalizeTransactions = (transactions) => {
    return transactions.map(tx => ({
        ...tx,
        user_id: String(tx.user_id).trim(),
        is_fraud: tx.is_fraud === true || tx.is_fraud === 'true' || tx.is_fraud === 1 || tx.is_fraud === '1',
    }));
};
