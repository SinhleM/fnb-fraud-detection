# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from dotenv import load_dotenv
import pandas as pd
import os

# Load environment variables from .env file
load_dotenv()

# --- DB Configuration ---
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "Admin@1234")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "fnb_fraud_db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# --- SQLAlchemy Engine and Session ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- FastAPI App ---
app = FastAPI(title="FNB Fraud Detection API")

# --- CORS Middleware ---
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
    signup_date: str  # String format for JSON

class Transaction(BaseModel):
    transaction_id: int
    user_id: int
    timestamp: str
    amount: float
    type: str
    channel: str
    location: str
    merchant: str
    is_fraud: Optional[int] = None
    rules_applied: Optional[str] = None

# --- Health Check ---
@app.get("/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

# --- Get Users ---
@app.get("/users", response_model=List[User])
def read_users():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM users ORDER BY user_id"))
            users_data = []
            for row in result:
                user_dict = row._asdict()
                if isinstance(user_dict.get("signup_date"), date):
                    user_dict["signup_date"] = user_dict["signup_date"].strftime("%Y-%m-%d")
                users_data.append(user_dict)
            return users_data
    except Exception as e:
        return {"error": f"Failed to fetch users: {str(e)}"}

# --- Get All Transactions ---
@app.get("/transactions", response_model=List[Transaction])
def read_transactions(user_id: Optional[int] = None):
    try:
        query = "SELECT * FROM transactions"
        params = {}
        if user_id:
            query += " WHERE user_id = :user_id"
            params["user_id"] = user_id

        with engine.connect() as conn:
            result = conn.execute(text(query), params)
            transactions_data = []
            for row in result:
                txn_dict = row._asdict()
                if isinstance(txn_dict.get("timestamp"), (pd.Timestamp, date)):
                    txn_dict["timestamp"] = txn_dict["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
                transactions_data.append(txn_dict)
            return transactions_data
    except Exception as e:
        return {"error": f"Failed to fetch transactions: {str(e)}"}

# --- Get Fraud Transactions ---
@app.get("/fraud-transactions", response_model=List[Transaction])
def read_fraud_transactions():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM transactions WHERE is_fraud = 1"))
            fraud_transactions_data = []
            for row in result:
                txn_dict = row._asdict()
                if isinstance(txn_dict.get("timestamp"), (pd.Timestamp, date)):
                    txn_dict["timestamp"] = txn_dict["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
                fraud_transactions_data.append(txn_dict)
            return fraud_transactions_data
    except Exception as e:
        return {"error": f"Failed to fetch fraud transactions: {str(e)}"}
