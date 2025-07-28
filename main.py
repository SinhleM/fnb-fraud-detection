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
    # ADDED 'http://localhost:5174' to the allowed origins
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Rule Description Mapping ---
RULE_DESCRIPTIONS = {
    "AmountExceedsThreshold": "Amount exceeded typical transaction limits",
    "HighFrequency": "Unusually high transaction frequency detected",
    "GeoMismatch": "Geographic location mismatch with user's usual activity",
    "TimeAnomaly": "Transaction occurred at an unusual time of day/night",
    "NewDevice": "Transaction initiated from a new or unrecognized device",
    "CardTesting": "Potential card testing activity (small/zero amount transaction)",
    "HighRiskMerchant": "Transaction with a merchant flagged as high-risk",
    "MultipleAttempts": "Multiple failed attempts before success (e.g., suspicious login or payment)",
    "SmallAmountUnusualTime": "Small amount at an unusual time (often linked to testing)",
    "LargeAmountUnusualChannel": "Large amount via an unusual channel (e.g., unusual online purchase)",
    # Add any other rules from your detect_fraud.py here
}

def get_better_rule_wording(rules_string: Optional[str]) -> str:
    if not rules_string:
        return ""
    
    rule_names = [rule.strip() for rule in rules_string.split(',') if rule.strip()]
    translated_rules = [RULE_DESCRIPTIONS.get(name, name) for name in rule_names]
    
    return ", ".join(translated_rules)


# --- Pydantic Models ---
class User(BaseModel):
    user_id: int
    name: str
    email: str
    account_type: str
    province: str
    signup_date: str
    initial_balance: Optional[float] = None

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
    balance_before_txn: Optional[float] = None
    balance_after_txn: Optional[float] = None
    fraud_score: Optional[float] = None

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
        query += " ORDER BY timestamp DESC"

        with engine.connect() as conn:
            result = conn.execute(text(query), params)
            transactions_data = []
            for row in result:
                txn_dict = row._asdict()
                if isinstance(txn_dict.get("timestamp"), (pd.Timestamp, date)):
                    txn_dict["timestamp"] = txn_dict["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
                
                if "rules_applied" in txn_dict and txn_dict["rules_applied"]:
                    txn_dict["rules_applied"] = get_better_rule_wording(txn_dict["rules_applied"])
                    
                transactions_data.append(txn_dict)
            return transactions_data
    except Exception as e:
        return {"error": f"Failed to fetch transactions: {str(e)}"}

# --- Get Fraud Transactions ---
@app.get("/fraud-transactions", response_model=List[Transaction])
def read_fraud_transactions():
    print("--- Fetching Fraud Transactions ---")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT
                    transaction_id, user_id, timestamp, amount, type, channel, location, merchant,
                    is_fraud, rules_applied, balance_before_txn, balance_after_txn, fraud_score
                FROM transactions
                WHERE is_fraud = 1
                ORDER BY timestamp DESC
            """))
            
            fraud_transactions_data = []
            for row in result:
                txn_dict = row._asdict()
                # print(f"  Processing transaction: {txn_dict.get('transaction_id')}, is_fraud: {txn_dict.get('is_fraud')}")
                if isinstance(txn_dict.get("timestamp"), (pd.Timestamp, date)):
                    txn_dict["timestamp"] = txn_dict["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
                
                if "rules_applied" in txn_dict and txn_dict["rules_applied"]:
                    txn_dict["rules_applied"] = get_better_rule_wording(txn_dict["rules_applied"])
                    
                fraud_transactions_data.append(txn_dict)
            
            print(f"--- Found {len(fraud_transactions_data)} fraud transactions to return ---")
            return fraud_transactions_data
    except Exception as e:
        print(f"--- Error fetching fraud transactions: {str(e)} ---")
        return {"error": f"Failed to fetch fraud transactions: {str(e)}"}