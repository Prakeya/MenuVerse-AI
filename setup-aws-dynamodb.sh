#!/bin/bash
# AWS DynamoDB Setup Script for MenuVerse-AI
# Run this script after configuring AWS CLI with your credentials

echo "Creating DynamoDB tables..."

# Create MenuItems table
aws dynamodb create-table \
  --table-name MenuItems \
  --attribute-definitions \
    AttributeName=restaurant_id,AttributeType=S \
    AttributeName=item_id,AttributeType=S \
  --key-schema \
    AttributeName=restaurant_id,KeyType=HASH \
    AttributeName=item_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

echo "MenuItems table created"

# Create Orders table
aws dynamodb create-table \
  --table-name Orders \
  --attribute-definitions \
    AttributeName=restaurant_id,AttributeType=S \
    AttributeName=order_id,AttributeType=S \
  --key-schema \
    AttributeName=restaurant_id,KeyType=HASH \
    AttributeName=order_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

echo "Orders table created"

# Create Analytics table
aws dynamodb create-table \
  --table-name Analytics \
  --attribute-definitions \
    AttributeName=restaurant_id,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
  --key-schema \
    AttributeName=restaurant_id,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

echo "Analytics table created"

echo "Waiting for tables to be active..."
aws dynamodb wait table-exists --table-name MenuItems --region us-east-1
aws dynamodb wait table-exists --table-name Orders --region us-east-1
aws dynamodb wait table-exists --table-name Analytics --region us-east-1

echo "All tables created and active!"