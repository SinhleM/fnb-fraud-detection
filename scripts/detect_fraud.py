# scripts/detect_fraud.py

import pandas as pd
import numpy as np
from datetime import timedelta

df = pd.read_csv("transactions.csv")
df['timestamp'] = pd.to_datetime(df['timestamp'])
df = df.sort_values(by=["user_id", "timestamp"]).reset_index(drop=True)

df['is_fraud'] = 0
df['rules_applied'] = ''
df['time_diff_from_last'] = df.groupby("user_id")["timestamp"].diff().dt.total_seconds()

def flag(df, mask, rule):
    df.loc[mask, 'is_fraud'] = 1
    df.loc[mask, 'rules_applied'] = df.loc[mask, 'rules_applied'].apply(
        lambda r: rule if r == '' else f"{r}|{rule}"
    )
    return df

# Rule: Large Withdrawal
mask = (df["amount"] > 10000) & (df["type"].str.lower() == "withdrawal")
df = flag(df, mask, "Large Withdrawal")

# Rule: Odd Hours
df['hour'] = df['timestamp'].dt.hour
mask = (df['hour'] < 4) | (df['hour'] > 23)
df = flag(df, mask, "Odd Hours")

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
df = flag(df, rf_flags, "Rapid Fire")

# Rule: New Location
def new_loc(group):
    mask = pd.Series(False, index=group.index)
    history = set()
    for i in range(len(group)):
        current = group.iloc[i]
        lookback = group[(group["timestamp"] < current["timestamp"]) & 
                         (group["timestamp"] >= current["timestamp"] - timedelta(days=30))]
        locations = set(lookback["location"].dropna())
        if current["location"] not in locations:
            mask.iloc[i] = True
    return mask

nl_flags = df.groupby("user_id", group_keys=False).apply(new_loc)
df = flag(df, nl_flags, "New Location")

df["rules_applied"].replace("", np.nan, inplace=True)
df.to_csv("transactions_with_fraud_flags.csv", index=False)
print("✅ Saved: transactions_with_fraud_flags.csv")
