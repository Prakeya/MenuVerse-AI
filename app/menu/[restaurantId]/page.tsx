import RestaurantMenuClient from '../../../components/RestaurantMenuClient'

export default async function RestaurantMenu({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = await params
  return (
    <div className="diner-theme discovery-map shimmer-root">
      <RestaurantMenuClient restaurantId={restaurantId} />
    </div>
  )
}
