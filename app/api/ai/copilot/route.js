import { NextResponse } from "next/server"

// POST: AI Copilot endpoint for intelligent suggestions
export async function POST(req) {
  try {
    const body = await req.json()
    const { action, data, restaurant_id } = body

    if (!action || !restaurant_id) {
      return NextResponse.json(
        { error: "Missing required fields: action, restaurant_id" },
        { status: 400 }
      )
    }

    // Mock AI copilot responses based on action type
    let response = {}

    switch (action) {
      case "menu_optimization":
        response = {
          suggestions: [
            "Consider adding more vegetarian options - they're trending",
            "Price point for 'Butter Chicken' is 15% above market average",
            "Remove 'Special Thali' - low sales in past 30 days"
          ],
          confidence: 0.85,
          impact: "high"
        }
        break

      case "pricing_strategy":
        response = {
          suggestions: [
            "Increase 'Biryani' price by 10% - high demand, low price sensitivity",
            "Create combo meal for 'Naan + Curry' to increase AOV",
            "Weekend special pricing could increase revenue by 20%"
          ],
          confidence: 0.78,
          impact: "medium"
        }
        break

      case "inventory_management":
        response = {
          suggestions: [
            "Order more basmati rice - stock will run out in 3 days",
            "Reduce chicken orders by 30% - slower sales this week",
            "Consider seasonal menu items for summer"
          ],
          confidence: 0.92,
          impact: "high"
        }
        break

      case "marketing_campaign":
        response = {
          suggestions: [
            "Launch 'Family Feast' campaign for weekends",
            "Target customers who ordered in last 7 days with 20% off",
            "Create Instagram reel featuring 'Chef's Special'"
          ],
          confidence: 0.75,
          impact: "medium"
        }
        break

      default:
        response = {
          suggestions: ["Analyze your data to get personalized recommendations"],
          confidence: 0.5,
          impact: "low"
        }
    }

    return NextResponse.json({
      action,
      restaurant_id,
      ...response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error in AI copilot:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}