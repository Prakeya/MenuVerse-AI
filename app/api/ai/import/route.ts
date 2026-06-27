import { NextRequest, NextResponse } from "next/server"

// POST: AI Import endpoint for menu/data import
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { import_type, data, restaurant_id } = body

    if (!import_type || !restaurant_id) {
      return NextResponse.json(
        { error: "Missing required fields: import_type, restaurant_id" },
        { status: 400 }
      )
    }

    // Mock AI import processing
    const mockResult = {
      import_id: `import_${Date.now()}`,
      import_type,
      restaurant_id,
      status: "completed",
      items_processed: data?.items?.length || 0,
      items_imported: data?.items?.length || 0,
      errors: [],
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      message: "Import completed successfully",
      result: mockResult
    })
  } catch (error) {
    console.error("Error in AI import:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
