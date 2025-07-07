# scripts/load_to_postgres.py

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

# --- Load environment variables ---
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD_RAW = os.getenv("POSTGRES_PASSWORD", "Admin@1234")
DB_PASSWORD = urllib.parse.quote_plus(DB_PASSWORD_RAW)  # URL encode password
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "fnb_fraud_db")

# --- Create the connection string ---
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def load_data_to_postgres():
    print("📦 Starting data loading process...")

    try:
        users_df = pd.read_csv("users.csv")
        txn_df = pd.read_csv("transactions_with_fraud_flags.csv")
        print("✅ CSVs loaded into DataFrames.")
    except FileNotFoundError as e:
        print(f"❌ CSV missing: {e}")
        return
    except Exception as e:
        print(f"❌ Error reading CSVs: {e}")
        return

    try:
        print(f"🔌 Connecting to PostgreSQL at {DB_HOST}:{DB_PORT}/{DB_NAME} as {DB_USER}...")
        engine = create_engine(DATABASE_URL)

        # --- Truncate tables safely before loading ---
        with engine.begin() as conn:
            conn.execute(text("TRUNCATE TABLE transactions RESTART IDENTITY CASCADE"))
            conn.execute(text("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
            print("🧹 Tables truncated successfully.")

        # --- Load users ---
        print("📥 Loading users into 'users' table...")
        users_df.to_sql("users", engine, if_exists="append", index=False)
        print("✅ Users table loaded.")

        # --- Load transactions ---
        print("📥 Loading transactions into 'transactions' table...")
        txn_df.to_sql("transactions", engine, if_exists="append", index=False)
        print("✅ Transactions table loaded.")

        print("🎉 All data loaded into PostgreSQL!")

    except SQLAlchemyError as e:
        print(f"❌ SQLAlchemy error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    load_data_to_postgres()
