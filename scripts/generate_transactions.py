# scripts/generate_transactions.py

import pandas as pd
from faker import Faker
import random
from datetime import timedelta

fake = Faker('en_ZA')
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
    transactions = []
    txn_id = 20000

    for _, user in users_df.iterrows():
        user_id = user["user_id"]
        last_time = fake.date_time_between(start_date="-60d", end_date="now")

        for _ in range(random.randint(3, 10)):
            timestamp = last_time + timedelta(minutes=random.randint(5, 1440))
            last_time = timestamp

            amount = round(random.uniform(20, 5000), 2)
            type_ = random.choice(TYPES)
            channel = random.choice(CHANNELS)
            location = random.choice(LOCATIONS)
            merchant = random.choice(MERCHANTS)

            # Simulate possible fraud
            if random.random() < 0.05:
                if type_ == "Transfer":
                    amount = round(random.uniform(10000, 20000), 2)
                    merchant = "Offshore Account"
                elif type_ == "Purchase":
                    amount = 10.00
                    merchant = "Card Testing Shop"
                    location = random.choice(LOCATIONS)

            transactions.append([
                txn_id, user_id, timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                amount, type_, channel, location, merchant
            ])
            txn_id += 1

    df = pd.DataFrame(transactions, columns=[
        "transaction_id", "user_id", "timestamp", "amount", "type",
        "channel", "location", "merchant"
    ])
    df.to_csv("transactions.csv", index=False)
    print(f"✅ Generated {len(df)} transactions and saved to transactions.csv")

if __name__ == "__main__":
    generate_transactions()
