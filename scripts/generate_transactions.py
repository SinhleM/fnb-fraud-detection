# scripts/generate_transactions.py (Modified to incorporate user balance)

import pandas as pd
from faker import Faker
import random
from datetime import timedelta

fake = Faker('en_US')
Faker.seed(123) 

MERCHANTS = [
    "Shoprite", "Woolworths", "Gautrain", "Puma Energy", "Game",
    "Takealot", "Clicks", "KFC", "Flight Centre", "Standard Bank ATM", "FNB ATM"
]

TYPES = ["Purchase", "Withdrawal", "Transfer", "Fare", "Deposit"]
CHANNELS = ["POS", "ATM", "Online", "App"]
LOCATIONS = [
    "Rosebank, GP", "Mowbray, WC", "Umhlanga, KZN", "Polokwane, LP",
    "Kimberley, NC", "Gqeberha, EC", "Potchefstroom, NW", "Mbombela, MP"
]

def generate_transactions(n=500, users_file="users.csv"):
    users_df = pd.read_csv(users_file)
    # Map user_id to their initial balance for tracking
    user_balances_tracker = {user['user_id']: user['initial_balance'] for index, user in users_df.iterrows()}

    transactions = []
    txn_id = 20000

    for _, user in users_df.iterrows():
        user_id = user["user_id"]
        # Use the tracked balance, which will be updated across transactions for this user
        current_balance = user_balances_tracker[user_id] 
        
        last_time = fake.date_time_between(start_date="-60d", end_date="now")

        num_user_txns = random.randint(3, 10)
        
        user_recent_locations = []

        for i in range(num_user_txns):
            balance_before_txn = current_balance # Store balance before this transaction

            timestamp = last_time + timedelta(minutes=random.randint(5, 1440))
            last_time = timestamp

            amount = round(random.uniform(20, 5000), 2)
            type_ = random.choice(TYPES)
            channel = random.choice(CHANNELS)
            location = random.choice(LOCATIONS)
            merchant = random.choice(MERCHANTS)

            user_recent_locations.append(location)
            if len(user_recent_locations) > 5: 
                user_recent_locations.pop(0)

            # Ensure normal withdrawals/transfers don't exceed current balance
            if type_ in ["Withdrawal", "Transfer"] and amount > current_balance:
                # Limit amount to current balance or a reasonable fraction if balance is very low
                amount = round(random.uniform(20, max(20, current_balance * 0.8)), 2)
                # If balance is extremely low, make sure amount is small but positive
                if amount <= 0 and current_balance > 0: amount = round(random.uniform(10, 50), 2)
                if current_balance <= 0: amount = 0 # Cannot withdraw from empty account for legitimate transactions

            # --- Simulate various types of fraud with a much lower, realistic probability ---
            if random.random() < 0.005: 
                fraud_type_choice = random.choice([
                    "large_withdrawal", "odd_hours", "rapid_fire", 
                    "new_location", "card_testing", "offshore_transfer", 
                    "excessive_withdrawal_transfer" # New fraud type
                ])

                if fraud_type_choice == "large_withdrawal":
                    type_ = "Withdrawal"
                    amount = round(random.uniform(55000, 150000), 2) 
                    merchant = "Unusual ATM"
                    channel = "ATM"
                    # This large amount can now exceed balance for fraud simulation
                elif fraud_type_choice == "odd_hours":
                    timestamp = timestamp.replace(hour=random.choice([0, 1, 2, 3, 23]), minute=random.randint(0, 59))
                    last_time = timestamp 
                elif fraud_type_choice == "rapid_fire":
                    # Generate 2 more quick transactions right here
                    for _ in range(2):
                        timestamp_rapid = last_time + timedelta(seconds=random.randint(5, 100))
                        last_time = timestamp_rapid
                        amount_rapid = round(random.uniform(50, 500), 2)
                        type_rapid = random.choice(["Purchase", "Transfer"])
                        channel_rapid = random.choice(["POS", "Online"])
                        location_rapid = random.choice(LOCATIONS)
                        merchant_rapid = random.choice(MERCHANTS)

                        # Update balance for rapid fire transactions as well
                        if type_rapid in ["Purchase", "Withdrawal", "Transfer", "Fare"]:
                            current_balance -= amount_rapid
                        elif type_rapid == "Deposit":
                            current_balance += amount_rapid
                        
                        transactions.append([
                            txn_id, user_id, timestamp_rapid.strftime("%Y-%m-%d %H:%M:%S"),
                            amount_rapid, type_rapid, channel_rapid, location_rapid, merchant_rapid,
                            balance_before_txn, current_balance # Include balance info
                        ])
                        txn_id += 1
                elif fraud_type_choice == "new_location":
                    new_loc_options = [loc for loc in LOCATIONS if loc not in user_recent_locations]
                    if new_loc_options:
                        location = random.choice(new_loc_options)
                    else: 
                        location = random.choice(LOCATIONS)
                elif fraud_type_choice == "card_testing":
                    type_ = "Purchase"
                    amount = 10.00
                    merchant = "Card Testing Shop"
                    channel = "Online"
                elif fraud_type_choice == "offshore_transfer":
                    type_ = "Transfer"
                    amount = round(random.uniform(10000, 20000), 2) 
                    merchant = "Offshore Account"
                    channel = "App"
                elif fraud_type_choice == "excessive_withdrawal_transfer": # New fraud scenario
                    type_ = random.choice(["Withdrawal", "Transfer"])
                    # Amount significantly larger than current balance, simulating overdraft/fraudulent emptying
                    # Ensure positive amount, even if balance is low
                    amount = round(random.uniform(current_balance * 1.5, current_balance * 3 + 1000) if current_balance > 1000 else random.uniform(1000, 5000), 2)
                    if amount <= 0: amount = random.uniform(100, 500) # Ensure a reasonable fraudulent amount
                    merchant = "Suspicious ATM" if type_ == "Withdrawal" else "Unknown Beneficiary"
                    channel = random.choice(["ATM", "Online"])


            # Update balance based on transaction type for current transaction
            if type_ in ["Purchase", "Withdrawal", "Transfer", "Fare"]:
                current_balance -= amount
            elif type_ == "Deposit":
                current_balance += amount
            
            # For fraudulent transactions, balance might go significantly negative.
            # For legitimate transactions, try to keep it reasonable.
            # Allowing up to -10,000 for overdraft for simulation, then cap.
            if current_balance < -10000:
                current_balance = -10000 + random.uniform(0, 500) # Cap extremely low balances

            transactions.append([
                txn_id, user_id, timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                amount, type_, channel, location, merchant,
                balance_before_txn, current_balance # Add balance information
            ])
            txn_id += 1
            
    df = pd.DataFrame(transactions, columns=[
        "transaction_id", "user_id", "timestamp", "amount", "type",
        "channel", "location", "merchant", "balance_before_txn", "balance_after_txn" # New columns
    ])
    df.to_csv("transactions.csv", index=False)
    print(f"✅ Generated {len(df)} transactions and saved to transactions.csv")

if __name__ == "__main__":
    generate_transactions()