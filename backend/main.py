from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional

load_dotenv()

DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "Admin@1234")  # use your actual password here
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "fnb_fraud_db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI(title="FNB Fraud Detection API")

# Pydantic models for response validation
class User(BaseModel):
    user_id: int
    name: str
    email: str
    account_type: str
    province: str
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
    is_fraud: Optional[bool] = None
    rules_applied: Optional[str] = None

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users", response_model=List[User])
def read_users():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM users ORDER BY user_id"))
        users = [dict(row) for row in result]
        return users

@app.get("/transactions", response_model=List[Transaction])
def read_transactions(user_id: Optional[int] = None):
    query = "SELECT * FROM transactions"
    params = {}
    if user_id:
        query += " WHERE user_id = :user_id"
        params["user_id"] = user_id
    with engine.connect() as conn:
        result = conn.execute(text(query), params)
        transactions = [dict(row) for row in result]
        return transactions

@app.get("/fraud-transactions", response_model=List[Transaction])
def read_fraud_transactions():
    query = "SELECT * FROM transactions WHERE is_fraud = true"
    with engine.connect() as conn:
        result = conn.execute(text(query))
        transactions = [dict(row) for row in result]
        return transactions
