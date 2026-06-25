# IAM User Setup for MenuVerse-AI

This guide will help you create an IAM user for Vercel deployment with DynamoDB access.

## Step 1: Create IAM User

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click **"Users"** in the left sidebar
3. Click **"Add user"**
4. Enter user details:
   - **User name**: `menuverse-vercel`
   - **Access type**: Check **"Programmatic access"** (this generates Access Key ID and Secret Access Key)
5. Click **"Next: Permissions"**

## Step 2: Set Permissions

Choose one of these options:

### Option A: Attach Existing Policies (Recommended for Production)

1. Click **"Attach existing policies directly"**
2. Search for and check these policies:
   - `AmazonDynamoDBFullAccess` (for full DynamoDB access)
   - OR create a custom policy with least privilege (see Option B)
3. Click **"Next: Tags"** → **"Next: Review"** → **"Create user"**

### Option B: Custom Policy (More Secure)

Click **"JSON"** and paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/MenuItems",
        "arn:aws:dynamodb:us-east-1:*:table/Orders",
        "arn:aws:dynamodb:us-east-1:*:table/Analytics",
        "arn:aws:dynamodb:us-east-1:*:table/LoyaltyProfiles",
        "arn:aws:dynamodb:us-east-1:*:table/Ratings",
        "arn:aws:dynamodb:us-east-1:*:table/RestaurantTables",
        "arn:aws:dynamodb:us-east-1:*:table/Users",
        "arn:aws:dynamodb:us-east-1:*:table/Promotions"
      ]
    }
  ]
}
```

**Important**: Replace `us-east-1` with your actual AWS region if different.

## Step 3: Save Credentials

After creating the user, you'll see a success page with:

1. **Access Key ID** - Copy this (e.g., `AKIAIOSFODNN7EXAMPLE`)
2. **Secret Access Key** - Click **"Show"** and copy this (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)

**⚠️ CRITICAL**: Save these credentials immediately! The Secret Access Key is only shown once.

## Step 4: Configure Vercel Environment Variables

1. Go to your Vercel project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these 3 variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `AWS_ACCESS_KEY_ID` | Your Access Key ID | Production, Preview, Development |
| `AWS_SECRET_ACCESS_KEY` | Your Secret Access Key | Production, Preview, Development |
| `AWS_REGION` | `us-east-1` (or your region) | Production, Preview, Development |

4. Click **"Save"**
5. Redeploy your application

## Step 5: Verify Setup

Test the connection by visiting your API endpoints:
- `https://your-app.vercel.app/api/menu/rest_001`
- `https://your-app.vercel.app/api/orders/rest_001`

If you see data (not mock data), the connection is working!

## Security Best Practices

1. **Never commit credentials to Git** - Use Vercel environment variables
2. **Use least privilege** - Option B policy is more secure than full access
3. **Rotate keys regularly** - Create new keys and delete old ones periodically
4. **Enable MFA** on your AWS root account
5. **Monitor usage** - Check CloudWatch for unusual activity

## Troubleshooting

**Error: "Missing AWS credentials"**
- Verify environment variables are set in Vercel
- Check for typos in variable names
- Redeploy after adding variables

**Error: "Access Denied"**
- Verify IAM policy allows the required actions
- Check that table ARNs match your region
- Ensure user has programmatic access enabled

**Error: "Table not found"**
- Verify tables are created in the correct region
- Check table names match exactly (case-sensitive)