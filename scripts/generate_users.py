# scripts/generate_users.py

import pandas as pd
from faker import Faker
import random

fake = Faker('en_ZA')
Faker.seed(42)

account_types = ["Cheque", "Savings", "Business", "Youth", "Premier"]
provinces = [
    "Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape",
    "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"
]

def generate_users(n=100):
    users = []
    for i in range(1, n + 1):
        name = fake.name()
        email = fake.email()
        account_type = random.choice(account_types)
        province = random.choice(provinces)
        signup_date = fake.date_between(start_date='-3y', end_date='today')
        users.append([1000 + i, name, email, account_type, province, signup_date])
    
    df = pd.DataFrame(users, columns=[
        "user_id", "name", "email", "account_type", "province", "signup_date"
    ])
    df.to_csv("users.csv", index=False)
    print(f"✅ Generated {n} users and saved to users.csv")

if __name__ == "__main__":
    generate_users(100)
