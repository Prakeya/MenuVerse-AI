import { db } from "@/lib/dynamodb"
import { PutCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { NextResponse } from "next/server"
import crypto from "crypto"

function isMockMode() {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

// Simple password hashing (in production, use bcrypt or similar)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// POST: Register a new user
export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, name, role = "customer", restaurant_id } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, name" },
        { status: 400 }
      )
    }

    const user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const hashedPassword = hashPassword(password)

    const user = {
      user_id,
      email,
      password: hashedPassword,
      name,
      role,
      restaurant_id: restaurant_id || null,
      created_at: new Date().toISOString()
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock POST auth: Register user ${email}`)
      return NextResponse.json({
        message: "User registered successfully (Mock)",
        user: { ...user, password: undefined }
      })
    }

    await db.send(new PutCommand({
      TableName: "Users",
      Item: user
    }))

    return NextResponse.json({
      message: "User registered successfully",
      user: { ...user, password: undefined }
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET: Login user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    const password = searchParams.get("password")

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: email, password" },
        { status: 400 }
      )
    }

    const hashedPassword = hashPassword(password)

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock GET auth: Login user ${email}`)
      // Mock login - accept any credentials in dev mode
      return NextResponse.json({
        message: "Login successful (Mock)",
        user: {
          user_id: "mock_user_1",
          email,
          name: "Mock User",
          role: "customer",
          token: "mock_jwt_token_123"
        }
      })
    }

    // Query by email (assuming email is a GSI or we scan)
    const result = await db.send(new QueryCommand({
      TableName: "Users",
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email }
    }))

    const users = result.Items || []
    const user = users.find(u => u.password === hashedPassword)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate simple token (in production, use JWT)
    const token = `token_${user.user_id}_${Date.now()}`

    return NextResponse.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        restaurant_id: user.restaurant_id,
        token
      }
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}