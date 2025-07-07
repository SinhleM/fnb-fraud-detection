import subprocess
import sys

print("🔧 Starting FNB Fraud Detection Pipeline...\n")

# Step 1: Generate users
print("👤 Generating users...")
# This calls scripts/generate_users.py to create users.csv
subprocess.run([sys.executable, "scripts/generate_users.py"], check=True)

# Step 2: Generate transactions
print("\n💳 Generating transactions...")
# This should call scripts/generate_transactions.py to create transactions.csv
subprocess.run([sys.executable, "scripts/generate_transactions.py"], check=True)

# Step 3: Detect fraud
print("\n🚨 Detecting fraud...")
# This should call scripts/detect_fraud.py to process transactions and add fraud flags
subprocess.run([sys.executable, "scripts/detect_fraud.py"], check=True)

# Step 4: Load to PostgreSQL
print("\n📦 Loading data into PostgreSQL...")
# This should call scripts/load_to_postgres.py to load data into the database
subprocess.run([sys.executable, "scripts/load_to_postgres.py"], check=True)

print("\n✅ Pipeline complete. Check your database.")
