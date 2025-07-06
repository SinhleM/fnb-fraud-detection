import subprocess

print("🔧 Starting FNB Fraud Detection Pipeline...\n")

# Step 1: Generate users
print("👤 Generating users...")
subprocess.run(["python", "scripts/generate_users.py"], check=True)

# Step 2: Generate transactions
print("\n💳 Generating transactions...")
subprocess.run(["python", "scripts/generate_transactions.py"], check=True)

# Step 3: Detect fraud
print("\n🚨 Detecting fraud...")
subprocess.run(["python", "scripts/detect_fraud.py"], check=True)

# Step 4: Load to PostgreSQL
print("\n📦 Loading data into PostgreSQL...")
subprocess.run(["python", "scripts/load_to_postgres.py"], check=True)

print("\n✅ Pipeline complete. Check your database.")
