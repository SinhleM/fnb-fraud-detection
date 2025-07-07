# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from datetime import date # Import date for type hinting if needed, or for explicit conversion
import pandas as pd # <--- ADDED THIS IMPORT STATEMENT

# Load environment variables from .env file
load_dotenv()

# --- DB config ---
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "Admin@1234")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "fnb_fraud_db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# --- SQLAlchemy Engine and Session ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- FastAPI app instance ---
app = FastAPI(title="FNB Fraud Detection API")

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class User(BaseModel):
    user_id: int
    name: str
    email: str
    account_type: str
    province: str
    # Changed type hint to str, and will ensure conversion in the endpoint
    signup_date: str

class Transaction(BaseModel):
    transaction_id: int
    user_id: int
    timestamp: str
    amount: float
    type: str
    channel: str
    location: str
    merchant: str
    is_fraud: Optional[int] = None # Changed to int as it's stored as 0 or 1
    rules_applied: Optional[str] = None

# --- API Routes ---

@app.get("/users", response_model=List[User])
def read_users():
    """
    Retrieves a list of all users from the 'users' table.
    Converts signup_date to string format for Pydantic validation.
    """
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM users ORDER BY user_id"))
        users_data = []
        for row in result:
            user_dict = row._asdict()
            # Convert datetime.date object to string 'YYYY-MM-DD'
            if isinstance(user_dict.get('signup_date'), date):
                user_dict['signup_date'] = user_dict['signup_date'].strftime("%Y-%m-%d")
            users_data.append(user_dict)
        return users_data

@app.get("/transactions", response_model=List[Transaction])
def read_transactions(user_id: Optional[int] = None):
    """
    Retrieves a list of transactions.
    Optionally filters transactions by user_id if provided.
    """
    query = "SELECT * FROM transactions"
    params = {}
    if user_id:
        query += " WHERE user_id = :user_id"
        params["user_id"] = user_id
    with engine.connect() as conn:
        result = conn.execute(text(query), params)
        # Ensure timestamp is string for Pydantic validation
        transactions_data = []
        for row in result:
            txn_dict = row._asdict()
            if isinstance(txn_dict.get('timestamp'), (pd.Timestamp, date)): # Handle potential datetime objects
                 txn_dict['timestamp'] = txn_dict['timestamp'].strftime("%Y-%m-%d %H:%M:%S")
            transactions_data.append(txn_dict)
        return transactions_data

@app.get("/fraud-transactions", response_model=List[Transaction])
def read_fraud_transactions():
    """
    Retrieves a list of transactions flagged as fraudulent.
    Compares 'is_fraud' to 1 (integer) as it's stored as 0 or 1.
    """
    with engine.connect() as conn:
        # Compare is_fraud directly to integer 1, as it's stored as 0 or 1.
        # This avoids the 'cannot cast type bigint to boolean' error.
        result = conn.execute(text("SELECT * FROM transactions WHERE is_fraud = 1"))
        # Ensure timestamp is string for Pydantic validation
        fraud_transactions_data = []
        for row in result:
            txn_dict = row._asdict()
            if isinstance(txn_dict.get('timestamp'), (pd.Timestamp, date)): # Handle potential datetime objects
                 txn_dict['timestamp'] = txn_dict['timestamp'].strftime("%Y-%m-%d %H:%M:%S")
            fraud_transactions_data.append(txn_dict)
        return fraud_transactions_data
