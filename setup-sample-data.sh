#!/bin/bash
# Add sample menu items to MenuItems table
# Run this AFTER creating the tables

echo "Adding sample menu items..."

# Sample restaurant ID (you can change this)
RESTAURANT_ID="rest_001"

# Add sample items
aws dynamodb put-item \
  --table-name MenuItems \
  --item '{
    "restaurant_id": {"S": "'$RESTAURANT_ID'"},
    "item_id": {"S": "item_001"},
    "name": {"S": "Butter Chicken"},
    "description": {"S": "Creamy tomato-based curry with tender chicken pieces"},
    "price": {"N": "299"},
    "category": {"S": "Main Course"},
    "available": {"BOOL": true},
    "image_url": {"S": "/biryani.png"},
    "avg_rating": {"N": "4.5"},
    "rating_count": {"N": "120"}
  }' \
  --region us-east-1

aws dynamodb put-item \
  --table-name MenuItems \
  --item '{
    "restaurant_id": {"S": "'$RESTAURANT_ID'"},
    "item_id": {"S": "item_002"},
    "name": {"S": "Biryani"},
    "description": {"S": "Fragrant basmati rice cooked with spices and chicken"},
    "price": {"N": "349"},
    "category": {"S": "Main Course"},
    "available": {"BOOL": true},
    "image_url": {"S": "/biryani.png"},
    "avg_rating": {"N": "4.7"},
    "rating_count": {"N": "200"}
  }' \
  --region us-east-1

aws dynamodb put-item \
  --table-name MenuItems \
  --item '{
    "restaurant_id": {"S": "'$RESTAURANT_ID'"},
    "item_id": {"S": "item_003"},
    "name": {"S": "Garlic Naan"},
    "description": {"S": "Soft bread with garlic and butter"},
    "price": {"N": "49"},
    "category": {"S": "Breads"},
    "available": {"BOOL": true},
    "image_url": {"S": "/naan.png"},
    "avg_rating": {"N": "4.3"},
    "rating_count": {"N": "85"}
  }' \
  --region us-east-1

aws dynamodb put-item \
  --table-name MenuItems \
  --item '{
    "restaurant_id": {"S": "'$RESTAURANT_ID'"},
    "item_id": {"S": "item_004"},
    "name": {"S": "Tikka Masala"},
    "description": {"S": "Grilled chicken in creamy masala sauce"},
    "price": {"N": "279"},
    "category": {"S": "Main Course"},
    "available": {"BOOL": true},
    "image_url": {"S": "/tikka_masala.png"},
    "avg_rating": {"N": "4.6"},
    "rating_count": {"N": "150"}
  }' \
  --region us-east-1

aws dynamodb put-item \
  --table-name MenuItems \
  --item '{
    "restaurant_id": {"S": "'$RESTAURANT_ID'"},
    "item_id": {"S": "item_005"},
    "name": {"S": "Margherita Pizza"},
    "description": {"S": "Classic pizza with tomato, mozzarella, and basil"},
    "price": {"N": "249"},
    "category": {"S": "Pizza"},
    "available": {"BOOL": true},
    "image_url": {"S": "/pizza.png"},
    "avg_rating": {"N": "4.4"},
    "rating_count": {"N": "95"}
  }' \
  --region us-east-1

echo "Sample menu items added successfully!"
echo "Restaurant ID: $RESTAURANT_ID"