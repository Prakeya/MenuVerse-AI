# MenuVerse-AI Deployment Guide

## Architecture Overview

```
Vercel (Frontend + API Routes) → AWS DynamoDB
```

### Components:
- **Frontend**: Next.js 15.0.0 with App Router
- **API Routes**: Next.js API routes (serverless functions on Vercel)
- **Database**: AWS DynamoDB (3 main tables)
- **Authentication**: NextAuth v4 with hardcoded credentials

### DynamoDB Tables:
1. **MenuItems** - Restaurant menu items
2. **Orders** - Customer orders
3. **Analytics** - Menu views and events
4. **Tables** - Restaurant table management
5. **Loyalty** - Customer loyalty program
6. **Ratings** - Customer ratings and reviews

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **AWS Account** - Sign up at [aws.amazon.com](https://aws.amazon.com)
3. **GitHub Repository** - Your code should be on GitHub

## Step 1: Set Up AWS DynamoDB

### Create DynamoDB Tables

1. Log into AWS Console and navigate to DynamoDB
2. Create the following tables:

#### Table 1: MenuItems
- **Table name**: `MenuItems`
- **Partition key**: `restaurant_id` (String)
- **Sort key**: `item_id` (String)
- **Capacity mode**: On-demand (pay per request)
- **Enable encryption**: Yes (AWS managed key)

#### Table 2: Orders
- **Table name**: `Orders`
- **Partition key**: `restaurant_id` (String)
- **Sort key**: `order_id` (String)
- **Capacity mode**: On-demand
- **Enable encryption**: Yes

#### Table 3: Analytics
- **Table name**: `Analytics`
- **Partition key**: `restaurant_id` (String)
- **Sort key**: `item_id` (String)
- **Capacity mode**: On-demand
- **Enable encryption**: Yes

#### Table 4: Tables
- **Table name**: `Tables`
- **Partition key**: `restaurant_id` (String)
- **Sort key**: `table_id` (String)
- **Capacity mode**: On-demand
- **Enable encryption**: Yes

#### Table 5: Loyalty
- **Table name**: `Loyalty`
- **Partition key**: `phone` (String)
- **Sort key**: `restaurant_id` (String)
- **Capacity mode**: On-demand
- **Enable encryption**: Yes

#### Table 6: Ratings
- **Table name**: `Ratings`
- **Partition key**: `restaurant_id` (String)
- **Sort key**: `rating_id` (String)
- **Capacity mode**: On-demand
- **Enable encryption**: Yes

### Create IAM User

1. Go to AWS IAM Console
2. Create a new user with the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/MenuItems",
        "arn:aws:dynamodb:*:*:table/Orders",
        "arn:aws:dynamodb:*:*:table/Analytics",
        "arn:aws:dynamodb:*:*:table/Tables",
        "arn:aws:dynamodb:*:*:table/Loyalty",
        "arn:aws:dynamodb:*:*:table/Ratings"
      ]
    }
  ]
}
```

3. Generate access keys for this user
4. **Save the Access Key ID and Secret Access Key** - you'll need these for Vercel

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Option B: Deploy via GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure the build

## Step 3: Configure Environment Variables in Vercel

In your Vercel project settings, go to **Settings → Environment Variables** and add:

### Required Variables:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate_a_random_secret_key_here
```

### Optional Variables:
```
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: Replace `https://your-app.vercel.app` with your actual Vercel deployment URL.

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 4: Initialize Your Database

After deployment, you need to add some initial data. You can do this via:

### Method 1: Using the Dashboard
1. Go to `/dashboard/menu` on your deployed app
2. Add menu items through the UI

### Method 2: Using AWS Console
1. Go to DynamoDB → Tables → MenuItems
2. Click "Create item" and add sample data

### Sample Menu Item Structure:
```json
{
  "restaurant_id": "rest_1",
  "item_id": "item_1",
  "name": "Margherita Pizza",
  "price": 12.99,
  "category": "Main Course",
  "description": "Classic tomato sauce, mozzarella, and fresh basil.",
  "image_url": "https://example.com/image.jpg",
  "available": true,
  "ingredients": ["dough", "tomato sauce", "mozzarella", "basil"],
  "allergens": ["gluten", "dairy"],
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## Step 5: Test Your Deployment

1. Visit your Vercel deployment URL
2. Test the landing page: `/`
3. Test the menu: `/menu/demo` or `/menu/rest_1`
4. Test the dashboard: `/login` (use `admin@menuverse.ai` / `password123`)
5. Test adding items to cart and placing orders

## Step 6: Custom Domain (Optional)

1. In Vercel, go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` environment variable to use your custom domain

## Important Notes

### Demo Mode
The app works in two modes:
- **Demo Mode** (no AWS keys): Uses local state, data is not persisted
- **Production Mode** (with AWS keys): Connects to DynamoDB, all data is persisted

### Security Considerations
1. **Never commit** `.env.local` or any file with real credentials
2. Use **environment variables** in Vercel for all sensitive data
3. The hardcoded NextAuth credentials are for demo purposes only - replace with proper authentication in production
4. Enable **AWS IAM** best practices (rotate keys regularly, use least privilege)

### Cost Optimization
- DynamoDB on-demand pricing: ~$1.88 per million reads/writes
- Vercel free tier: 100GB bandwidth, 1,000 serverless function invocations per day
- For hackathon/demo purposes, costs should be minimal (< $5/month)

## Troubleshooting

### Build Errors
- Ensure all TypeScript errors are resolved: `npm run build`
- Check that all imports are correct
- Verify environment variables are set in Vercel

### API Route Errors
- Check Vercel function logs in the dashboard
- Ensure AWS credentials are correct
- Verify DynamoDB tables exist with correct names

### Database Connection Issues
- Verify AWS region matches your DynamoDB region
- Check IAM user permissions
- Ensure tables are in the same AWS region as your credentials

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod
```

## Support

For issues or questions:
- Check the Vercel deployment logs
- Review AWS CloudWatch logs for DynamoDB issues
- Ensure all environment variables are correctly set

---

**Happy Hacking! 🚀**