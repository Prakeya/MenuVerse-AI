import { MenuItem } from './types'

export const MOCK_DISHES: MenuItem[] = [
  {
    item_id: 'd1', restaurant_id: 'demo',
    name: 'Butter Chicken', category: 'Indian', price: 18.99,
    description: 'Tender chicken in a rich, creamy tomato-butter sauce with aromatic spices.',
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    available: true, badges: ['trending', 'bestseller'], prep_time: 18,
    ingredients: ['Chicken', 'Tomato', 'Butter', 'Cream', 'Ginger', 'Garlic', 'Garam Masala', 'Turmeric', 'Coriander'],
    allergens: ['Dairy', 'Tree Nuts'],
    isSignatureDish: true, pairsWith: ['d8', 'd5']
  },
  {
    item_id: 'd2', restaurant_id: 'demo',
    name: 'Margherita Pizza', category: 'Italian', price: 14.99,
    description: 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    available: true, badges: ['favourite'], prep_time: 15,
    ingredients: ['Pizza Dough', 'San Marzano Tomatoes', 'Fresh Mozzarella', 'Basil', 'Olive Oil', 'Salt'],
    allergens: ['Gluten', 'Dairy'], pairsWith: ['d4', 'd8']
  },
  {
    item_id: 'd3', restaurant_id: 'demo',
    name: 'Sushi Platter', category: 'Japanese', price: 24.99,
    description: "Chef's selection of 12 premium nigiri and maki rolls with wasabi.",
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    available: true, badges: ['chef-special'], prep_time: 22,
    ingredients: ['Sushi Rice', 'Salmon', 'Tuna', 'Shrimp', 'Nori', 'Wasabi', 'Pickled Ginger', 'Soy Sauce'],
    allergens: ['Fish', 'Shellfish', 'Soy', 'Gluten'], pairsWith: ['d8', 'd4']
  },
  {
    item_id: 'd4', restaurant_id: 'demo',
    name: 'Caesar Salad', category: 'Salads', price: 12.99,
    description: 'Crisp romaine lettuce with house-made Caesar dressing, parmesan, and croutons.',
    image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=600&q=80',
    available: true, badges: ['light-healthy'], prep_time: 8,
    ingredients: ['Romaine Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing', 'Olive Oil', 'Garlic', 'Anchovy'],
    allergens: ['Dairy', 'Gluten', 'Fish'], pairsWith: ['d6', 'd8']
  },
  {
    item_id: 'd5', restaurant_id: 'demo',
    name: 'Chocolate Lava Cake', category: 'Desserts', price: 9.99,
    description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream.',
    image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=80',
    available: true, badges: ['trending', 'bestseller'], prep_time: 12,
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla Bean Ice Cream'],
    allergens: ['Dairy', 'Gluten', 'Eggs'], pairsWith: ['d8']
  },
  {
    item_id: 'd6', restaurant_id: 'demo',
    name: 'Truffle Burger', category: 'American', price: 16.99,
    description: 'Premium beef patty with truffle aioli, aged cheddar, and caramelized onions.',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    available: true, badges: ['spicy'], prep_time: 14,
    ingredients: ['Beef Patty', 'Brioche Bun', 'Aged Cheddar', 'Truffle Aioli', 'Caramelized Onions', 'Lettuce', 'Tomato'],
    allergens: ['Gluten', 'Dairy'], pairsWith: ['d4', 'd8']
  },
  {
    item_id: 'd7', restaurant_id: 'demo',
    name: 'Chicken Tikka Masala', category: 'Indian', price: 17.99,
    description: 'Marinated chicken in a spiced, creamy curry sauce with basmati rice.',
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    available: true, badges: [], prep_time: 20,
    ingredients: ['Chicken', 'Yogurt', 'Tomato', 'Cream', 'Onion', 'Ginger', 'Garlic', 'Garam Masala', 'Basmati Rice'],
    allergens: ['Dairy'], pairsWith: ['d8']
  },
  {
    item_id: 'd8', restaurant_id: 'demo',
    name: 'Mango Lassi', category: 'Drinks', price: 4.99,
    description: 'Refreshing yogurt-based mango drink with a hint of cardamom.',
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    available: true, badges: ['light-healthy'], prep_time: 3,
    ingredients: ['Yogurt', 'Mango', 'Sugar', 'Cardamom', 'Ice'],
    allergens: ['Dairy'], pairsWith: ['d1', 'd2', 'd6']
  },
  {
    item_id: 'd9', restaurant_id: 'demo',
    name: 'Iced Tea', category: 'Drinks', price: 3.99,
    description: 'Freshly brewed iced tea with a hint of lemon.',
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    available: true, badges: [], prep_time: 2,
    ingredients: ['Tea', 'Lemon', 'Sugar', 'Ice'],
    allergens: [], pairsWith: ['d6', 'd2']
  },
  {
    item_id: 'd10', restaurant_id: 'demo',
    name: 'Sparkling Water', category: 'Drinks', price: 2.99,
    description: 'Premium sparkling mineral water.',
    image_url: 'https://images.unsplash.com/photo-1523362628745-0c100fc988a2?auto=format&fit=crop&w=600&q=80',
    available: true, badges: [], prep_time: 1,
    ingredients: ['Water', 'Carbon Dioxide'],
    allergens: [], pairsWith: ['d1', 'd3', 'd7']
  },
]

export const CATEGORIES = ['Indian', 'Italian', 'Japanese', 'American', 'Salads', 'Desserts', 'Drinks']

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Mandarin' },
]