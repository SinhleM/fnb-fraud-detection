# scripts/generate_users.py

import pandas as pd
from faker import Faker
import random

# Use en_US and manually customize for SA context
fake = Faker('en_US')
Faker.seed(42) # Keeping your seed for reproducibility

account_types = ["Cheque", "Savings", "Business", "Youth", "Premier"]
provinces = [
    "Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape",
    "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"
]
email_domains = ["email.co.za", "webmail.co.za", "mail.co.za"]

def generate_users(n=50): # Recommended: Increased default from 10 to 50 for more realistic data
    users = []
    for i in range(1, n + 1):
        name = fake.name()
        username = name.lower().replace(" ", ".").replace("'", "")
        email = f"{username}@{random.choice(email_domains)}"
        account_type = random.choice(account_types)
        province = random.choice(provinces)
        signup_date = fake.date_between(start_date='-3y', end_date='today')
        
        # Adding an initial balance between R1,000 and R100,000 for realism
        initial_balance = round(random.uniform(1000, 100000), 2) 
        
        users.append([1000 + i, name, email, account_type, province, signup_date, initial_balance])
    
    df = pd.DataFrame(users, columns=[
        "user_id", "name", "email", "account_type", "province", "signup_date", "initial_balance" # Added initial_balance
    ])
    df.to_csv("users.csv", index=False)
    print(f"✅ Generated {n} users and saved to users.csv")

if __name__ == "__main__":
    generate_users(n=50) # Call with 50 users by default as recommended