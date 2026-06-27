import { db } from "@/lib/dynamodb"
import { UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import mockData from "@/lib/mockMenuItems.json"

const mockFilePath = path.join(process.cwd(), "lib", "mockMenuItems.json")

function isMockMode() {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

function getMockMenu(): any[] {
  try {
    if (fs.existsSync(mockFilePath)) {
      return JSON.parse(fs.readFileSync(mockFilePath, "utf8"))
    }
  } catch (e) {
    console.error("Failed to read mock menu file", e)
  }
  return mockData as any[]
}

function saveMockMenu(data: any[]): void {
  try {
    fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2), "utf8")
  } catch (e) {
    console.error("Failed to write mock menu file", e)
  }
}

// PUT: Update item details
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string; itemId: string }> }) {
  const resolvedParams = await params
  const { slug, itemId } = resolvedParams // slug = restaurant_id, itemId = item_id

  try {
    const body = await req.json()
    const { name, price, description, category, available, image_url } = body

    if (isMockMode()) {
      let menu = getMockMenu()
      const idx = menu.findIndex(item => item.restaurant_id === slug && item.item_id === itemId)
      if (idx === -1) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 })
      }

      const updatedItem = {
        ...menu[idx],
        name: name !== undefined ? name : menu[idx].name,
        price: price !== undefined ? Number(price) : menu[idx].price,
        description: description !== undefined ? description : menu[idx].description,
        category: category !== undefined ? category : menu[idx].category,
        available: available !== undefined ? Boolean(available) : menu[idx].available,
        image_url: image_url !== undefined ? image_url : menu[idx].image_url
      }

      menu[idx] = updatedItem
      saveMockMenu(menu)
      return NextResponse.json({ message: "Item updated successfully (Mock)", item: updatedItem })
    }

    // AWS DynamoDB Update Mode
    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }

    const updateExpressionParts: string[] = []
    const expressionAttributeValues: Record<string, any> = {}
    const expressionAttributeNames: Record<string, string> = {}

    if (name !== undefined) {
      updateExpressionParts.push("#name = :name")
      expressionAttributeValues[":name"] = name
      expressionAttributeNames["#name"] = "name"
    }
    if (price !== undefined) {
      updateExpressionParts.push("price = :price")
      expressionAttributeValues[":price"] = Number(price)
    }
    if (description !== undefined) {
      updateExpressionParts.push("description = :description")
      expressionAttributeValues[":description"] = description
    }
    if (category !== undefined) {
      updateExpressionParts.push("category = :category")
      expressionAttributeValues[":category"] = category
    }
    if (available !== undefined) {
      updateExpressionParts.push("available = :available")
      expressionAttributeValues[":available"] = Boolean(available)
    }
    if (image_url !== undefined) {
      updateExpressionParts.push("image_url = :image_url")
      expressionAttributeValues[":image_url"] = image_url
    }

    if (updateExpressionParts.length === 0) {
      return NextResponse.json({ error: "No fields provided for update" }, { status: 400 })
    }

    const command = new UpdateCommand({
      TableName: "MenuItems",
      Key: { restaurant_id: slug, item_id: itemId },
      UpdateExpression: "SET " + updateExpressionParts.join(", "),
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ReturnValues: "ALL_NEW"
    })

    const result = await db.send(command)
    return NextResponse.json({ message: "Item updated successfully in DynamoDB", item: result.Attributes })
  } catch (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// PATCH: Toggle Sold Out / Availability
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string; itemId: string }> }) {
  const resolvedParams = await params
  const { slug, itemId } = resolvedParams

  try {
    const body = await req.json()
    const { available } = body

    if (available === undefined) {
      return NextResponse.json({ error: "Missing required field: available" }, { status: 400 })
    }

    if (isMockMode()) {
      let menu = getMockMenu()
      const idx = menu.findIndex(item => item.restaurant_id === slug && item.item_id === itemId)
      if (idx === -1) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 })
      }

      menu[idx].available = Boolean(available)
      saveMockMenu(menu)
      return NextResponse.json({ message: "Item availability toggled (Mock)", item: menu[idx] })
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }
    const result = await db.send(new UpdateCommand({
      TableName: "MenuItems",
      Key: { restaurant_id: slug, item_id: itemId },
      UpdateExpression: "SET available = :available",
      ExpressionAttributeValues: { ":available": Boolean(available) },
      ReturnValues: "ALL_NEW"
    }))

    return NextResponse.json({ message: "Item availability toggled in DynamoDB", item: result.Attributes })
  } catch (error) {
    console.error("Error toggling availability:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// DELETE: Delete menu item
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string; itemId: string }> }) {
  const resolvedParams = await params
  const { slug, itemId } = resolvedParams

  try {
    if (isMockMode()) {
      let menu = getMockMenu()
      const originalLength = menu.length
      menu = menu.filter((item: any) => !(item.restaurant_id === slug && item.item_id === itemId))
      
      if (menu.length === originalLength) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 })
      }

      saveMockMenu(menu)
      return NextResponse.json({ message: "Item deleted successfully (Mock)" })
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }
    await db.send(new DeleteCommand({
      TableName: "MenuItems",
      Key: { restaurant_id: slug, item_id: itemId }
    }))

    return NextResponse.json({ message: "Item deleted successfully from DynamoDB" })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
