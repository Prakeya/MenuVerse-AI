# 🎯 MENUVERSE MASTER PROMPT v2.0
## Complete Production System with Admin Dual-Layer Architecture

---

## 📋 SYSTEM OVERVIEW

**MenuVerse** is a dual-layer restaurant OS in Next.js with:
1. **DINER LAYER** (Brand-forward, emotional, premium)
2. **ADMIN LAYER** (Clean white, functional, data-focused)
3. **LOGIN GATING** (Owner vs. Visitor selection on entry)

---

## 🔐 PHASE 1: AUTHENTICATION & ROLE ROUTING

### Entry Point Logic
```
User Visits → "Who are you?"
├─ Owner/Admin
│  └─ Login → Admin Dashboard (White UI, Analytics + AI Import only)
└─ Visitor/Diner
   └─ Scan QR or Direct → Restaurant Storefront (MenuVerse Brand Layer)
```

### Admin Access - ANALYTICS & AI IMPORT ONLY
- **Left Sidebar Menu** shows ONLY:
  - 📊 Analytics (Order trends, popularity charts, revenue)
  - 🤖 AI Import (Menu sync, auto-descriptions, pricing optimizer)
  - ⚙️ Settings (Basic restaurant info)
  - 🚪 Logout
- **Hidden from Admin:**
  - Cart management
  - Checkout flows
  - Diner-facing pages
  - Inventory (for MVP)

### Visitor/Diner Access
- Direct to MenuVerse brand layer
- No authentication required
- QR code serves restaurant context

---

## 🎨 PHASE 2: MENUVERSE DINER BRAND SYSTEM

### COLOR PALETTE (STRICT)
| Element | Color | Usage |
|---------|-------|-------|
| Hero/Footer Background | `#16140F` | Warm near-black, restaurant lighting |
| Body Background | `#FAFAF8` | Warm off-white |
| Primary Accent | `#F2A93B` | Gold only accent (MenuVerse signature) |
| Secondary Accent | `#D85C42` | Spicy/trending tags only |
| Text (Body) | `#2A2520` | Warm dark text |
| Text (Light) | `#FAFAF8` | On dark backgrounds |

**HARD RULE:** Only `#F2A93B` for accent colors system-wide.

---

### TYPOGRAPHY HIERARCHY

#### Tier-0: Hero Single Line (RARE)
- Font: General Sans 800
- Size: 36–56px
- Color: White
- Case: Title case or all caps
- Example: "Real Flavors. Real Fast. Right Here."
- Usage: Hero headline ONLY

#### Tier-1: Section Headlines (REPEAT)
Pattern (ALWAYS):
1. Eyebrow label (Plus Jakarta Sans 600, 12–13px, small-caps, `#F2A93B` background)
2. Main headline (General Sans 700, 28–36px, `#2A2520`)
3. Gold underline (24px solid `#F2A93B`)

Example:
```
✨ FEATURED DISHES
Chef's Picks & Trending
━━━━━━━━━━━━━━━━ (24px gold line)
```

#### Tier-2: Body & Secondary
- Font: Plus Jakarta Sans (400, 500, 600)
- Size: 14–18px
- Color: `#2A2520` or `#666660`
- Usage: descriptions, prices, CTAs

---

### IMAGERY STANDARDS

✅ **REQUIRED:**
- Editorial food photography with:
  - Steam/shimmer effect visible
  - Depth of field (blurred background)
  - Professional plating
  - Warm professional lighting
  - Garnish & texture visible
  - Shot from 45° angle (cinematic)

❌ **BANNED:**
- Flat ecommerce white-background images
- Overly saturated colors
- Artificial-looking stock photos
- Food on plain white/gray

**Source:** Professional food photographers or AI-generated editorial food (DALL-E 3 / Midjourney fine-tuned prompts)

---

## 🎪 PHASE 3: INTERACTION & EMOTION LAYER

### 1. DISH SELECTION MOMENT
```javascript
// Interaction
Click Dish → 
├─ Dish lifts up (subtle translateY -8px, scale 1.02)
├─ Background softly warms (opacity filter or slight color shift)
├─ Non-selected items fade (opacity 0.7)
├─ Selected dish glows subtly (box-shadow: gold glow)
└─ Detail panel slides in from right
```

### 2. EMOTIONAL COLOR FEEDBACK
```
Veg Dishes       → Green leaf accent glow
Spicy Dishes     → Warm orange/red pulse animation
Premium/Special  → Golden shimmer effect
Sold Out         → Desaturated + "frozen" overlay (grayscale + opacity 0.6)
```

### 3. SMART BADGE SYSTEM
Auto-display contextual badges (no manual labels):
- 🔥 Chef's Special
- 📈 Most Ordered Today (live count)
- 🌶️ Spicy (if tags match)
- 🥗 Light & Healthy
- ✨ New Arrival (< 7 days)
- ⏰ Limited Today (stock < 5)

**Placement:** Top-right corner of dish card, overlaid
**Animation:** Subtle pulse (0.5s ease-in-out)

### 4. HOVER = FOOD COMES ALIVE
```css
.dish-card:hover {
  /* Lift effect */
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  
  /* Food image shimmer */
  background: linear-gradient(
    135deg,
    transparent,
    rgba(242, 169, 59, 0.1),
    transparent
  ) moving;
  
  /* Price highlight */
  .price {
    color: #F2A93B;
    font-weight: 700;
  }
  
  /* Add button emerges */
  .add-btn {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 5. ADD TO CART FEEDBACK
```javascript
// Micro-interaction
Click Add Button →
├─ Button bounces (scale: 1 → 1.15 → 1)
├─ Tray icon animates from button to cart icon
├─ Subtle toast: "Added to your tray 🍽️"
├─ Price adjustment ripples
└─ Cart count updates with pulse animation
```

**Duration:** 400ms total (smooth but snappy)

### 6. MENU AS CURATED JOURNEY
Structure menu as editorial chapters, not lists:
```
1. 🎯 Recommended For You (AI-curated based on time/trending)
2. 👨‍🍳 Chef's Picks & Specials (Editorial curation)
3. 🍕 Categories (Traditional browsing fallback)
4. 🔥 Trending Now (Real-time popularity)
5. ⭐ Top Rated (High scores + reviews)
```

Each section has its own hero image & narrative.

### 7. DISH DETAIL SPOTLIGHT
Clicking a dish opens a "cinematic focus view":
```
Left Side: Large 2x food image (professional food photography)
Right Side: 
├─ Dish name (Tier-1 style)
├─ Chef's story (50 words max, emotional narrative)
├─ Key ingredients (bullet list, minimal)
├─ 🔥 Spice level (1-5)
├─ ⭐ Rating + reviews (top 1-2 only)
├─ Price (large, gold accent)
├─ Add to Cart (primary CTA)
└─ Pairing suggestions (AI recommendations)
```

**Backdrop:** Semi-transparent dark overlay, close on outside click
**Animation:** Smooth zoom-in from card position

### 8. REAL-TIME POPULARITY LAYER
```javascript
// Live "Being Ordered" pulse
Dishes being ordered in real-time show:
├─ Subtle gold pulse animation (1.5s loop)
├─ Badge: "🔥 Hot Right Now" (auto-appear/disappear)
├─ Small counter: "23 orders today"
└─ Cards slightly rise in visual priority (1-2% scale)
```

**Data Source:** WebSocket connection to order stream
**Update Frequency:** Every 30 seconds aggregate

### 9. AMBIENT MENU MODE (TIME-AWARE UI)
```javascript
// Auto-adjust mood based on time
if (hour < 12) {
  // Morning: Bright, fresh tones
  bgColor = '#FAFAF8' (lighter)
  accentPulse = 'energetic' (faster animations)
  mood = 'fresh breakfast energy'
}
else if (hour < 17) {
  // Afternoon: Balanced
  bgColor = '#FAFAF8'
  accentPulse = 'normal'
}
else if (hour < 22) {
  // Evening: Warm golden restaurant lighting
  bgColor = '#16140F' (darker)
  lighting = 'warm amber' (overlay filter)
  accentPulse = 'cozy' (slower)
  mood = 'intimate dining'
}
else {
  // Night: Cinematic, moody
  bgColor = '#0F0D0A' (very dark)
  lighting = 'golden spotlights'
  accentPulse = 'mysterious' (subtle)
  mood = 'late-night indulgence'
}
```

### 10. AI CHEF NARRATOR LAYER
Contextual suggestions while browsing (subtle, non-intrusive):

**Placement:** Small floating card (bottom-right)
**Trigger:** 3 seconds of hovering on dish

```
"✨ Pro tip: Pairs perfectly with garlic naan"
"👥 Popular combo: Butter Chicken + Jasmine Rice"
"⭐ Most customers add lassi with this"
```

**Animation:** Fade in from transparent, slide up 4px
**Auto-hide:** 5 seconds or on interaction
**Logic:** Based on dish tags + order history

---

## 🗺️ PHASE 4: FOOD DISCOVERY MAP

### Core Concept
Transform traditional menu into an **interactive culinary journey**, not a linear list.

### Implementation

#### Discovery Map Components
```
┌─────────────────────────────────────────┐
│  Cuisine Explorer - Visual Food Map     │
├─────────────────────────────────────────┤
│                                         │
│   ◉ Indian            ◉ Italian         │
│      ├─ Butter Chicken                  │
│      ├─ Tikka Masala                    │
│      └─ Biryani                         │
│                                         │
│   ◉ Asian              ◉ Street Food    │
│      ├─ Pad Thai                        │
│      ├─ Ramen                           │
│      └─ Sushi                           │
│                                         │
│                                         │
│   ◉ Desserts           ◉ Beverages      │
│                                         │
└─────────────────────────────────────────┘
```

#### Visual Node Design
Each dish/category = visual "location":
```
┌──────────────────┐
│ [Food Image]     │
│                  │
│ Butter Chicken   │
│ ⭐⭐⭐⭐⭐ 1.2K  │
│ $12 • Spicy 🌶️  │
└──────────────────┘

On Hover:
├─ Expand with details
├─ Show ingredients popup
├─ Display AI pairing suggestions
└─ Reveal "Add to Tray" button
```

#### Interaction Model
```javascript
// Discovery Map Navigation
User hovers over dish node
├─ Node enlarges (scale 1.1)
├─ Related dishes highlight (connection lines appear)
├─ Background zooms slightly (parallax effect)
└─ Detail panel slides in

User clicks on dish
├─ Smooth zoom-in animation
├─ Full spotlight view opens
├─ Map fades to 30% opacity backdrop
└─ "Back to Map" button appears

User scrolls/zooms map
├─ Feels like exploring a city
├─ Smoothness = "traveling" sensation
├─ Edges show hints of other cuisine clusters
└─ Minimap in corner shows current location
```

#### Visual Behavior
- **Clustering:** Similar cuisines group nearby
- **Connection Lines:** Ingredients/pairings show as soft lines
- **Glow Effects:** Currently viewing cluster glows gold
- **Animation Speed:** Slower (500-800ms) to feel explored, not rushed
- **Zoom Levels:** 
  - Level 1: All categories visible
  - Level 2: Single category, all dishes
  - Level 3: Dish detail spotlight

#### Mobile Adaptation
```
Mobile (< 768px):
├─ Vertical scroll with card-based discovery
├─ Swipe left/right for categories
├─ Tap-to-expand detail
└─ Maintains "journey" feeling with smooth transitions
```

---

## 🔄 PHASE 5: BACKEND → FRONTEND SYSTEM DEBUG

### CRITICAL MANDATORY TASKS

#### Step 1: Normalize API Response
```javascript
// api/menu.js (Backend)
app.get('/api/restaurants/:id/menu', (req, res) => {
  const menu = db.getMenu(req.params.id);
  
  // ALWAYS return normalized array
  res.json({
    success: true,
    data: Array.isArray(menu) ? menu : [],
    count: (menu || []).length
  });
});
```

#### Step 2: Frontend Proxy Setup
```javascript
// pages/api/[...slug].js (Next.js API route)
export default async function handler(req, res) {
  const { slug } = req.query;
  const path = slug.join('/');
  
  console.log(`🔍 PROXY REQUEST: ${path}`);
  
  try {
    const response = await axios.get(
      `${process.env.BACKEND_URL}/${path}`,
      { params: req.query }
    );
    
    console.log(`✅ PROXY RESPONSE:`, response.data);
    res.json(response.data);
  } catch (error) {
    console.error(`❌ PROXY ERROR:`, error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
```

#### Step 3: React State Management
```javascript
// components/MenuLoader.jsx
import { useState, useEffect } from 'react';

export default function MenuLoader({ restaurantId }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        console.log(`📡 FETCHING menu for restaurant:`, restaurantId);
        
        const response = await fetch(`/api/restaurants/${restaurantId}/menu`);
        const json = await response.json();
        
        console.log(`📦 RAW RESPONSE:`, json);
        
        // Safe extraction
        let menuData = json.data || json.menu || json || [];
        menuData = Array.isArray(menuData) ? menuData : [];
        
        console.log(`🎯 NORMALIZED MENU DATA:`, menuData);
        
        setMenu(menuData);
        setError(null);
      } catch (err) {
        console.error(`💥 FETCH ERROR:`, err);
        setError(err.message);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, [restaurantId]);
  
  // Debug Button
  const testApi = async () => {
    console.log('🧪 TEST API BUTTON CLICKED');
    const response = await fetch(`/api/restaurants/rest_1/menu`);
    const data = await response.json();
    console.log('🧪 TEST DATA:', data);
  };
  
  return (
    <div>
      <button onClick={testApi}>🧪 Test API</button>
      {loading && <p>Loading menu...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <p>Items loaded: {menu.length}</p>
      {menu.length === 0 && !loading && <p>❌ No items displayed</p>}
      {menu.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>${item.price}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Step 4: Response Shape Validation
```javascript
// utils/menuValidator.js
export function validateMenuResponse(response) {
  const issues = [];
  
  if (!response) issues.push('Response is null/undefined');
  if (!Array.isArray(response.data)) issues.push('data is not array');
  
  (response.data || []).forEach((item, idx) => {
    if (!item.id) issues.push(`Item ${idx} missing id`);
    if (!item.name) issues.push(`Item ${idx} missing name`);
    if (typeof item.price !== 'number') issues.push(`Item ${idx} price not number`);
  });
  
  if (issues.length > 0) {
    console.error('❌ VALIDATION ISSUES:', issues);
    return false;
  }
  
  console.log('✅ Response validated');
  return true;
}
```

---

## 🎨 PHASE 6: COMPONENT ARCHITECTURE

### Page Structure
```
MenuVerse/
├── pages/
│   ├── index.jsx (Landing/Hero)
│   ├── restaurant/[id]/index.jsx (Storefront)
│   ├── restaurant/[id]/menu.jsx (Discovery Map)
│   ├── restaurant/[id]/dish/[dishId].jsx (Detail Spotlight)
│   ├── login.jsx (Owner/Visitor Selection)
│   └── admin/
│       ├── dashboard.jsx (Analytics Only)
│       └── ai-import.jsx (AI Menu Sync)
│
├── components/
│   ├── DinerLayer/
│   │   ├── Hero.jsx
│   │   ├── DiscoveryMap.jsx
│   │   ├── DishCard.jsx
│   │   ├── DishDetailSpotlight.jsx
│   │   ├── SmartBadge.jsx
│   │   ├── ChefNarrator.jsx
│   │   └── PopularityPulse.jsx
│   │
│   ├── AdminLayer/
│   │   ├── AnalyticsDashboard.jsx
│   │   ├── AIImportPanel.jsx
│   │   └── AdminSidebar.jsx
│   │
│   └── Shared/
│       ├── Wave Divider SVG
│       ├── LogoStrip.jsx
│       └── Navigation.jsx
│
├── styles/
│   ├── menuverse-diner.css (Brand layer only)
│   ├── admin-clean.css (White, minimal)
│   └── animations.css (Global)
│
└── hooks/
    ├── useMenu.js (Menu API hook)
    ├── useAmbientMode.js (Time-aware theming)
    └── usePopularityStream.js (WebSocket orders)
```

---

## 🎬 PHASE 7: ANIMATION & TIMING

### Global Animation Library
```css
/* Smooth, premium feel - never jarring */

@keyframes liftHover {
  0% { transform: translateY(0); }
  100% { transform: translateY(-12px); }
}

@keyframes goldPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(242, 169, 59, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(242, 169, 59, 0); }
}

@keyframes shimmer {
  0%, 100% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes foodZoom {
  0% { transform: scale(0.95) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes cartBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Duration Standards */
$duration-micro: 300ms;   /* Tiny interactions */
$duration-short: 400ms;   /* Hovers, fades */
$duration-medium: 600ms;  /* Page transitions */
$duration-long: 900ms;    /* Discovery map zoom */

/* Easing Standards */
$ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
$ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
$ease-slow: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

---

## 🔒 ADMIN DASHBOARD RULES

### Analytics View (WHITE, CLEAN UI)
```
Header: "Restaurant Analytics"
├─ Date range picker
├─ Order count card (large, minimal)
├─ Revenue card (large, minimal)
└─ Charts section
    ├─ Orders over time (line chart)
    ├─ Top dishes (bar chart)
    ├─ Category performance (pie)
    └─ Customer trends (area)

NO COLORS except:
- White background (#FFFFFF)
- Light gray accents (#F5F5F5)
- Dark text (#333333)
- Blue for interactive elements (#0066CC)
```

### AI Import View (WHITE, CLEAN UI)
```
Header: "AI Menu Sync"
├─ Import status
├─ Last sync: [timestamp]
├─ Auto-descriptions toggle
├─ AI pricing optimizer toggle
├─ Sync now button (blue)
└─ Import log (table)
    ├─ Timestamp
    ├─ Action
    ├─ Status
    └─ Details

NO MenuVerse branding here
Keep functional, not emotional
```

### Admin Sidebar (LEFT, MINIMAL)
```
Logo [Restaurant Name]

📊 Analytics
🤖 AI Import
⚙️ Settings
🚪 Logout

No other menu items in MVP
```

---

## 🚀 PHASE 8: IMPLEMENTATION CHECKLIST

### Backend Setup
- [ ] Normalize menu API response (always array in `data` field)
- [ ] Add order stream WebSocket for popularity tracking
- [ ] Create admin analytics endpoints
- [ ] Implement AI menu import API
- [ ] Add timestamp tracking for "new" and "trending" badges

### Frontend Setup
- [ ] Create proxy routes in Next.js `/api`
- [ ] Implement menu fetch hook with error handling
- [ ] Set up ambient mode time-detection
- [ ] Create responsive grid for discovery map
- [ ] Build dish detail spotlight modal

### Styling
- [ ] Import General Sans & Plus Jakarta Sans fonts
- [ ] Create CSS modules for MenuVerse brand
- [ ] Build admin white UI separately
- [ ] Implement animation library
- [ ] Create mobile responsive breakpoints

### Testing
- [ ] Test API response normalization (0 items bug fix)
- [ ] Test dish selection state management
- [ ] Test mobile discovery map navigation
- [ ] Test add-to-cart flow end-to-end
- [ ] Verify admin access gating

---

## 💡 PRO TIPS FOR EXCELLENCE

1. **Every interaction should feel intentional** — No accidental hovers
2. **Premium = Slow animations** — 400-600ms feels luxurious, 150ms feels cheap
3. **Gold should glow, not scream** — Use subtle shadows, not neon
4. **Food photography is the hero** — Let it breathe with space around it
5. **Micro-interactions delight** — Bounce, shimmer, pulse, lift (use all 4)
6. **Mobile first doesn't mean mobile-only** — Desktop gets the cinematic experience
7. **Whitespace = elegance** — Don't fill every pixel
8. **Color consistency = brand trust** — `#F2A93B` everywhere, nowhere else
9. **Narrative > Numbers** — Tell the food's story, not just price
10. **Loading states matter** — Skeleton screens, not blank pages

---

## 🎯 SUCCESS CRITERIA

✅ **Backend**
- Menu API returns consistent, normalized array
- No undefined/mismatch in response shape
- 0 items bug completely eliminated

✅ **Frontend**
- State correctly stores and renders menu
- .map() renders all items correctly
- No hydration/SSR mismatch

✅ **UI/UX**
- Admin layer is white and functional
- Diner layer feels premium and warm
- Every interaction has satisfying feedback
- Discovery map feels like exploration, not browsing
- Real-time popularity pulse works smoothly

✅ **Performance**
- Page load < 2s (optimized images)
- Smooth 60fps animations
- No layout shift on interactions

---

## 📧 FINAL NOTES

This is your **production blueprint**. Follow it exactly:
- Colors are **non-negotiable**
- Typography hierarchy is **locked**
- Admin must stay white
- Food photography must be **editorial**, not ecommerce
- Every animation has **purpose**, not just decoration

When in doubt, ask: *"Does this make the food experience feel premium and alive?"*

If yes → ship it.
If no → iterate.

---

**End of MenuVerse Master Prompt v2.0** ✨
