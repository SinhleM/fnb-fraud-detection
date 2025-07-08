# scripts/detect_fraud.py (Updated with a New Balance-Based Rule)

import pandas as pd
import numpy as np
from datetime import timedelta

df = pd.read_csv("transactions.csv")
df['timestamp'] = pd.to_datetime(df['timestamp'])
df = df.sort_values(by=["user_id", "timestamp"]).reset_index(drop=True)

df['is_fraud'] = 0
df['rules_applied'] = ''
df['fraud_score'] = 0 
df['time_diff_from_last'] = df.groupby("user_id")["timestamp"].diff().dt.total_seconds()

def flag(df, mask, rule, score_increment=1): 
    df.loc[mask, 'rules_applied'] = df.loc[mask, 'rules_applied'].apply(
        lambda r: rule if r == '' else f"{r}|{rule}"
    )
    df.loc[mask, 'fraud_score'] += score_increment 
    return df

# Rule: Large Withdrawal - Adjusted for more realistic ZAR context
mask = (df["amount"] > 50000) & (df["type"].str.lower() == "withdrawal")
df = flag(df, mask, "Large Withdrawal", score_increment=2) 

# Rule: Odd Hours
df['hour'] = df['timestamp'].dt.hour
mask = (df['hour'] < 4) | (df['hour'] > 23)
df = flag(df, mask, "Odd Hours", score_increment=1) 

# Rule: Rapid Fire (3 txns in 5 mins)
def rapid_fire(group):
    mask = pd.Series(False, index=group.index)
    for i in range(len(group)):
        if i >= 2:
            delta = group.iloc[i]["timestamp"] - group.iloc[i-2]["timestamp"]
            if delta.total_seconds() <= 300:
                mask.iloc[i] = True
                mask.iloc[i-1] = True
                mask.iloc[i-2] = True
    return mask

rf_flags = df.groupby("user_id", group_keys=False).apply(rapid_fire)
df = flag(df, rf_flags, "Rapid Fire", score_increment=2) 

# Rule: New Location
def new_loc(group):
    mask = pd.Series(False, index=group.index)
    for i in range(len(group)):
        current = group.iloc[i]
        lookback = group[(group["timestamp"] < current["timestamp"]) & 
                         (group["timestamp"] >= current["timestamp"] - timedelta(days=30))]
        locations = set(lookback["location"].dropna())
        if current["location"] not in locations:
            mask.iloc[i] = True
    return mask

nl_flags = df.groupby("user_id", group_keys=False).apply(new_loc)
df = flag(df, nl_flags, "New Location", score_increment=1) 

# NEW RULE: Excessive Withdrawal/Transfer Relative to Balance
# This flags withdrawals or transfers that are significantly more than the balance available.
# We'll use a threshold, e.g., amount is > 1.2 times balance (allowing for small overdrafts)
# This rule specifically targets transactions where the amount is much higher than the balance before the transaction.
mask = (df["type"].isin(["Withdrawal", "Transfer"])) & \
       (df["amount"] > df["balance_before_txn"] * 1.2) # Amount is 20% more than balance
       # This condition helps avoid flagging legitimate small transactions that barely go over
       # df["balance_before_txn"] > 0 # Optionally, only apply if user had some balance to begin with

df = flag(df, mask, "Excessive Txn relative to Balance", score_increment=3) # High score as it's very suspicious

# Final decision for 'is_fraud' based on combined fraud_score
FRAUD_SCORE_THRESHOLD = 3 
df['is_fraud'] = (df['fraud_score'] >= FRAUD_SCORE_THRESHOLD).astype(int)

df["rules_applied"].replace("", np.nan, inplace=True)
df.to_csv("transactions_with_fraud_flags.csv", index=False)
print("✅ Saved: transactions_with_fraud_flags.csv")