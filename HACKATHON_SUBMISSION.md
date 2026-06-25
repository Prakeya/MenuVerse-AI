# Hackathon Submission Guide - AWS Setup

## ⚠️ Important Note

**I cannot directly access your AWS account or create resources for you.** You'll need to follow these steps yourself. I've provided all the scripts and instructions to make this easy.

---

## Step 1: Create DynamoDB Tables (5 minutes)

### Option A: Using AWS CLI (Fastest)

1. **Install AWS CLI** (if not installed):
   ```bash
   # Windows
   winget install Amazon.AWSCLI
   
   # Mac
   brew install awscli
   
   # Linux
   sudo apt-get install awscli
   ```

2. **Configure AWS credentials**:
   ```bash
   aws configure
   ```
   Enter your AWS Access Key ID, Secret Access Key, and region (us-east-1)

3. **Run the setup script**:
   ```bash
   cd c:\Users\Admin\.gemini\antigravity\scratch\localmenu
   bash setup-aws-dynamodb.sh
   ```

### Option B: Using AWS Console (Visual)

1. Go to https://console.aws.amazon.com/dynamodb/
2. Click **"Create table"**
3. Create these 3 tables:

   **Table 1: MenuItems**
   - Table name: `MenuItems`
   - Partition key: `restaurant_id` (String)
   - Sort key: `item_id` (String)
   - Capacity: On-demand
   - Click "Create table"

   **Table 2: Orders**
   - Table name: `Orders`
   - Partition key: `restaurant_id` (String)
   - Sort key: `order_id` (String)
   - Capacity: On-demand
   - Click "Create table"

   **Table 3: Analytics**
   - Table name: `Analytics`
   - Partition key: `restaurant_id` (String)
   - Sort key: `timestamp` (String)
   - Capacity: On-demand
   - Click "Create table"

4. Wait 1-2 minutes for each table to be created

---

## Step 2: Add Sample Data (2 minutes)

Run the sample data script:
```bash
bash setup-sample-data.sh
```

Or add manually via AWS Console:
1. Go to MenuItems table
2. Click **"Explore table items"** → **"Create item"**
3. Add the 5 sample items listed in `setup-sample-data.sh`

---

## Step 3: Create IAM User (3 minutes)

Follow the detailed instructions in `IAM_SETUP.md`:

1. Go to https://console.aws.amazon.com/iam/
2. Create user `menuverse-vercel` with programmatic access
3. Attach permissions (use Option B custom policy for better security)
4. **SAVE THE CREDENTIALS** - You'll get:
   - AWS Access Key ID: `AKIA...`
   - AWS Secret Access Key: `wJalr...`
5. Add these to Vercel environment variables

---

## Step 4: Screenshot for Submission

### What to Screenshot:

1. **DynamoDB Tables Page**:
   - Go to https://console.aws.amazon.com/dynamodb/
   - Screenshot showing all 3 tables: MenuItems, Orders, Analytics
   - Status should show "Active"

2. **MenuItems Table Items**:
   - Click on MenuItems table
   - Click "Explore table items"
   - Screenshot showing the 5 sample items you added

3. **IAM User Credentials** (REDACT SENSITIVE DATA):
   - Go to IAM → Users → menuverse-vercel
   - Screenshot showing the user exists
   - **⚠️ REDACT the actual Access Key ID and Secret Access Key** for security
   - Or screenshot the policy attached to the user

### How to Take Screenshot on Windows:
- Press `Win + Shift + S` to open Snipping Tool
- Select the area to capture
- Save as PNG

---

## Step 5: Deploy to Vercel

1. Push your code to GitHub (already done ✅)
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables:
   - `AWS_ACCESS_KEY_ID` = Your IAM user access key
   - `AWS_SECRET_ACCESS_KEY` = Your IAM user secret key
   - `AWS_REGION` = us-east-1
5. Click "Deploy"

---

## Quick Checklist for Submission

- [ ] 3 DynamoDB tables created (MenuItems, Orders, Analytics)
- [ ] Tables set to On-Demand capacity
- [ ] 5 sample menu items added to MenuItems
- [ ] IAM user "menuverse-vercel" created
- [ ] IAM user has DynamoDB access policy
- [ ] Credentials saved (Access Key ID + Secret Access Key)
- [ ] Screenshot of DynamoDB console showing tables
- [ ] Screenshot of MenuItems with sample data
- [ ] Screenshot of IAM user (with redacted credentials)
- [ ] Vercel deployment with AWS credentials configured

---

## Need Help?

If you get stuck:
1. Check `DYNAMODB_SETUP.md` for detailed table schemas
2. Check `IAM_SETUP.md` for detailed IAM instructions
3. Check `setup-aws-dynamodb.sh` and `setup-sample-data.sh` for CLI commands

**Remember**: I cannot access your AWS account or take screenshots for you. You'll need to complete these steps manually.