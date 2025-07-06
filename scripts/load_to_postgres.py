# scripts/load_to_postgres.py

import pandas as pd
from sqlalchemy import create_engine
import os

# Load environment variables or hardcode your credentials here
DB_USER = os.getenv("POSTGRES_USER", "postgres_admin")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "Admin1234")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "fnb_fraud_db")

# Create the connection string
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def load_data_to_postgres():
    print("Loading CSVs...")
    users_df = pd.read_csv("users.csv")
    txn_df = pd.read_csv("transactions_with_fraud_flags.csv")

    print("Connecting to PostgreSQL...")
    engine = create_engine(DATABASE_URL)

    print("Loading users data into 'users' table...")
    users_df.to_sql("users", engine, if_exists="replace", index=False)
    print("Users table loaded.")

    print("Loading transactions data into 'transactions' table...")
    txn_df.to_sql("transactions", engine, if_exists="replace", index=False)
    print("Transactions table loaded.")

    print("All data loaded successfully into PostgreSQL!")

if __name__ == "__main__":
    load_data_to_postgres()
