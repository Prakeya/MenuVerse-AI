// Analytics views schema - placeholder for DynamoDB table definition
export const ANALYTICS_VIEWS_TABLE = "AnalyticsViews"

export interface AnalyticsViewItem {
  restaurant_id: string
  item_id: string
  timestamp: string
  views: number
}
