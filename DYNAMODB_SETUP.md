# DynamoDB Tables Setup Guide

This document describes all DynamoDB tables required for the MenuVerse-AI backend.

## Prerequisites

1. AWS Account with DynamoDB access
2. AWS CLI configured or AWS Console access
3. Region: `us-east-1` (or your preferred region)

## Tables to Create

### 1. MenuItems

**Purpose:** Store restaurant menu items

**Primary Key:**
- Partition Key: `restaurant_id` (String)
- Sort Key: `item_id` (String)

**Attributes:**
- `restaurant_id` (String) - Restaurant identifier
- `item_id` (String) - Unique item identifier
- `name` (String) - Item name
- `description` (String) - Item description
- `price` (Number) - Item price
- `category` (String) - Category (Starters, Main Course, etc.)
- `available` (Boolean) - Availability status
- `image_url` (String) - Image URL
- `avg_rating` (Number) - Average rating (optional)
- `rating_count` (Number) - Number of ratings (optional)

**Capacity Mode:** On-demand (pay-per-request)

---

### 2. Orders

**Purpose:** Store customer orders

**Primary Key:**
- Partition Key: `restaurant_id` (String)
- Sort Key: `order_id` (String)

**Attributes:**
- `restaurant_id` (String) - Restaurant identifier
- `order_id` (String) - Unique order identifier
- `customer_name` (String) - Customer name
- `items` (List/Map) - Array of ordered items
  - Each item: `{ item_id, name, quantity, price }`
- `total_amount` (Number) - Total order amount
- `status` (String) - Order status (PENDING, PREPARING, READY, COMPLETED, CANCELLED)
- `created_at` (String) - ISO timestamp
- `table_id` (String) - Associated table (optional)
- `customer_id` (String) - Customer identifier (optional)

**Capacity Mode:** On-demand (pay-per-request)

---

### 3. Analytics

**Purpose:** Store analytics events and logs

**Primary Key:**
- Partition Key: `restaurant_id` (String)
- Sort Key: `timestamp#event_id` (String)

**Attributes:**
- `restaurant_id` (String) - Restaurant identifier
- `timestamp` (String) - ISO timestamp
- `event_id` (String) - Unique event identifier
- `event_type` (String) - Type of event (page_view, order_placed, etc.)
- `user_id` (String) - User identifier (optional)
- `item_id` (String) - Related menu item (optional)
- `metadata` (Map) - Additional event data

**Capacity Mode:** On-demand (pay-per-request)

**Note:** You can also use a composite sort key or add a GSI for querying by event_type.

---

### 4. LoyaltyProfiles

**Purpose:** Store customer loyalty program data

**Primary Key:**
- Partition Key: `customer_id` (String)
- Sort Key: `restaurant_id` (String)

**Attributes:**
- `customer_id` (String) - Customer identifier
- `restaurant_id` (String) - Restaurant identifier
- `points` (Number) - Loyalty points balance
- `tier` (String) - Loyalty tier (Bronze, Silver, Gold)
- `total_visits` (Number) - Total number of visits
- `total_spent` (Number) - Total amount spent
- `updated_at` (String) - Last updated timestamp

**Capacity Mode:** On-demand (pay-per-request)

---

### 5. Ratings

**Purpose:** Store customer ratings and reviews

**Primary Key:**
- Partition Key: `restaurant_id` (String)
- Sort Key: `rating_id` (String)

**Alternative Primary Key (for item-specific ratings):**
- Partition Key: `restaurant_id` (String)
- Sort Key: `item_id` (String)

**Note:** You may want to create a GSI to query ratings by item_id.

**Attributes:**
- `rating_id` (String) - Unique rating identifier
- `restaurant_id` (String) - Restaurant identifier
- `item_id` (String) - Menu item identifier (optional)
- `customer_id` (String) - Customer identifier
- `rating` (Number) - Rating value (1-5)
- `review` (String) - Text review (optional)
- `created_at` (String) - ISO timestamp
- `updated_at` (String) - Last updated timestamp (optional)

**Capacity Mode:** On-demand (pay-per-request)

---

### 6. RestaurantTables

**Purpose:** Store restaurant table information

**Primary Key:**
- Partition Key: `restaurant_id` (String)
- Sort Key: `table_id` (String)

**Attributes:**
- `table_id` (String) - Unique table identifier
- `restaurant_id` (String) - Restaurant identifier
- `table_number` (Number) - Table number
- `capacity` (Number) - Seating capacity
- `status` (String) - Table status (available, occupied, reserved)
- `current_order_id` (String) - Current active order (optional)
- `created_at` (String) - ISO timestamp

**Capacity Mode:** On-demand (pay-per-request)

---

### 7. Users (Optional but Recommended)

**Purpose:** Store user accounts and authentication

**Primary Key:**
- Partition Key: `user_id` (String)

**GSI:**
- Index Name: `email-index`
- Partition Key: `email` (String)

**Attributes:**
- `user_id` (String) - Unique user identifier
- `email` (String) - User email (unique)
- `password` (String) - Hashed password
- `name` (String) - User name
- `role` (String) - User role (customer, admin, staff)
- `restaurant_id` (String) - Associated restaurant (for staff)
- `created_at` (String) - ISO timestamp

**Capacity Mode:** On-demand (pay-per-request)

---

### 8. Promotions (Optional)

**Purpose:** Store promotional campaigns

**Primary Key:**
- Partition Key: `restaurant_id` (String)
- Sort Key: `promo_id` (String)

**Attributes:**
- `promo_id` (String) - Unique promotion identifier
- `restaurant_id` (String) - Restaurant identifier
- `title` (String) - Promotion title
- `description` (String) - Promotion description
- `discount_type` (String) - "percentage" or "fixed"
- `discount_value` (Number) - Discount value
- `valid_from` (String) - Start date (ISO)
- `valid_until` (String) - End date (ISO)
- `applicable_items` (List) - List of applicable item IDs
- `min_order_amount` (Number) - Minimum order for promo
- `usage_limit` (Number) - Max usage count (optional)
- `usage_count` (Number) - Current usage count
- `is_active` (Boolean) - Active status
- `created_at` (String) - ISO timestamp

**Capacity Mode:** On-demand (pay-per-request)

---

## AWS Console Setup Steps

### Option 1: Using AWS Console

1. Go to [AWS DynamoDB Console](https://console.aws.amazon.com/dynamodb/)
2. Click **"Create table"**
3. For each table:
   - Enter **Table name**
   - Set **Partition key** and **Sort key** as specified above
   - Select **"On-demand"** capacity mode
   - Click **"Create table"**

### Option 2: Using AWS CLI

```bash
# Set your region
export AWS_REGION=us-east-1

# Create MenuItems table
aws dynamodb create-table \
  --table-name MenuItems \
  --attribute-definitions \
    AttributeName=restaurant_id,AttributeType=S \
    AttributeName=item_id,AttributeType=S \
  --key-schema \
    AttributeName=restaurant_id,KeyType=HASH \
    AttributeName=item_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Create Orders table
aws dynamodb create-table \
  --table-name Orders \
  --attribute-definitions \
    AttributeName=restaurant_id,AttributeType=S \
    AttributeName=order_id,AttributeType=S \
  --key-schema \
    AttributeName=restaurant_id,KeyType=HASH \
    AttributeName=order_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Create Analytics table
aws dynamodb create-table \
  --table-name Analytics \
  --attribute-definitions \
    AttributeName=restaurant_id,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
  --key-schema \
    AttributeName=restaurant_id,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Create LoyaltyProfiles table
aws dynamodb create-table \
  --table-name LoyaltyProfiles \
  --attribute-definitions \
    AttributeName=customer_id,AttributeType=S \
    AttributeName=restaurant_id,AttributeType=S \
  --key-schema \
    AttributeName=customer_id,KeyType=HASH \
    AttributeName=restaurant_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Create Ratings table
aws dynamodb create-table \
  --table-name Ratings \
  --attribute-definitions \
    AttributeName=restaurant_id,AttributeType=S \
    AttributeName=rating_id,AttributeType=S \
  --key-schema \
    AttributeName=restaurant_id,KeyType=HASH \
    AttributeName=rating_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Create RestaurantTables table
aws dynamodb create-table \
  --table-name RestaurantTables \
  --attribute-definitions \
    AttributeName=restaurant_id,AttributeType=S \
    AttributeName=table_id,AttributeType=S \
  --key-schema \
    AttributeName=restaurant_id,KeyType=HASH \
    AttributeName=table_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Create Users table (optional)
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions \
    AttributeName=user_id,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=user_id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Create Promotions table (optional)
aws dynamodb create-table \
  --table-name Promotions \
  --attribute-definitions \
    AttributeName=restaurant_id,AttributeType=S \
    AttributeName=promo_id,AttributeType=S \
  --key-schema \
    AttributeName=restaurant_id,KeyType=HASH \
    AttributeName=promo_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

## Environment Variables

After creating tables, set these environment variables in your deployment (Vercel, .env.local, etc.):

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
```

## Testing

The application runs in **mock mode** when AWS credentials are not configured, using local JSON files for development. To test with real DynamoDB:

1. Configure AWS credentials
2. Create all required tables
3. Set environment variables
4. Restart the application

## Notes

- All tables use **On-Demand** capacity mode for simplicity
- The app gracefully falls back to mock mode if credentials are missing
- Table creation typically takes 1-2 minutes per table
- Consider enabling Point-in-Time Recovery for production tables