"use client"

import { useState, useEffect } from "react"

export default function Home() {
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  // Analytics Stats
  const [busiestHour, setBusiestHour] = useState("N/A")

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    itemId: "",
    name: "",
    price: "",
    category: "Mains",
    description: ""
  })

  // Action feedback states
  const [submittingItem, setSubmittingItem] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)

  // Fetch Menu, Orders, and Analytics
  const fetchData = async () => {
    // 1. Fetch Menu (from popular dishes endpoint to get views directly mapped!)
    try {
      const popularRes = await fetch("/api/analytics/rest_1/popular")
      if (popularRes.ok) {
        const menuData = await popularRes.json()
        setMenuItems(menuData)
      } else {
        // Fallback to basic menu if popular endpoint fails
        const menuRes = await fetch("/api/menu/rest_1")
        if (menuRes.ok) {
          const menuData = await menuRes.json()
          setMenuItems(menuData)
        }
      }
    } catch (e) {
      console.error("Error fetching menu/analytics:", e)
    } finally {
      setLoadingMenu(false)
    }

    // 2. Fetch Orders
    try {
      const ordersRes = await fetch("/api/orders/rest_1")
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }
    } catch (e) {
      console.error("Error fetching orders:", e)
    } finally {
      setLoadingOrders(false)
    }

    // 3. Fetch Peak Hours for Busiest Hour Stat
    try {
      const peakRes = await fetch("/api/analytics/rest_1/peak-hours")
      if (peakRes.ok) {
        const peakData = await peakRes.json()
        const busiest = peakData.reduce((max, current) => 
          current.views > max.views ? current : max, 
          { hour: "N/A", views: 0 }
        )
        setBusiestHour(busiest.views > 0 ? busiest.hour : "N/A")
      }
    } catch (e) {
      console.error("Error fetching peak hours:", e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-fill itemId based on name for convenience
  const handleNameChange = (e) => {
    const nameVal = e.target.value
    const suggestedId = "item_" + nameVal.toLowerCase().replace(/[^a-z0-9]/g, "_")
    setFormData(prev => ({
      ...prev,
      name: nameVal,
      itemId: prev.itemId ? prev.itemId : suggestedId
    }))
  }

  // Handle Form Submission for Adding/Updating Menu Item
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setSubmittingItem(true)
    try {
      const res = await fetch("/api/menu/rest_1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          item_id: formData.itemId,
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          description: formData.description,
          available: true
        })
      })

      if (res.ok) {
        setIsModalOpen(false)
        setFormData({
          itemId: "",
          name: "",
          price: "",
          category: "Mains",
          description: ""
        })
        await fetchData()
      } else {
        const errData = await res.json()
        alert("Error saving item: " + errData.error)
      }
    } catch (error) {
      alert("Request failed: " + error.message)
    } finally {
      setSubmittingItem(false)
    }
  }

  // Track item view event when card is clicked
  const handleTrackView = async (itemId) => {
    try {
      await fetch(`/api/analytics/rest_1/${itemId}`, { method: "POST" })
      
      // Silently reload data to update the view counter in real-time
      const popularRes = await fetch("/api/analytics/rest_1/popular")
      if (popularRes.ok) {
        const menuData = await popularRes.json()
        setMenuItems(menuData)
      }
      
      // Reload peak hours
      const peakRes = await fetch("/api/analytics/rest_1/peak-hours")
      if (peakRes.ok) {
        const peakData = await peakRes.json()
        const busiest = peakData.reduce((max, current) => 
          current.views > max.views ? current : max, 
          { hour: "N/A", views: 0 }
        )
        setBusiestHour(busiest.views > 0 ? busiest.hour : "N/A")
      }
    } catch (e) {
      console.error("Failed to track item view:", e)
    }
  }

  // Toggle availability state (PATCH)
  const handleToggleAvailability = async (e, itemId, currentAvailable) => {
    e.stopPropagation()
    try {
      const res = await fetch(`/api/menu/rest_1/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ available: !currentAvailable })
      })

      if (res.ok) {
        await fetchData()
      }
    } catch (e) {
      console.error("Failed to toggle availability:", e)
    }
  }

  // Delete menu item (DELETE)
  const handleDeleteItem = async (e, itemId) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this menu item?")) return

    try {
      const res = await fetch(`/api/menu/rest_1/${itemId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        await fetchData()
      }
    } catch (e) {
      console.error("Failed to delete item:", e)
    }
  }

  // Place a Random Test Order to demonstrate functionality instantly
  const handlePlaceTestOrder = async () => {
    if (menuItems.length === 0) {
      alert("Please add some menu items first!")
      return
    }

    setPlacingOrder(true)
    
    // Pick 1-3 random items from the menu
    const numItems = Math.min(Math.floor(Math.random() * 3) + 1, menuItems.length)
    const shuffled = [...menuItems].sort(() => 0.5 - Math.random())
    const selectedItems = shuffled.slice(0, numItems).map(item => ({
      item_id: item.item_id,
      name: item.name,
      price: item.price,
      quantity: Math.floor(Math.random() * 2) + 1
    }))

    const customers = ["Amit Sharma", "Priya Patel", "Vikram Singh", "Neha Gupta", "Rohan Mehta", "Ananya Rao"]
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)]

    try {
      const res = await fetch("/api/orders/rest_1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_name: randomCustomer,
          items: selectedItems
        })
      })

      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Failed to place order:", error)
    } finally {
      setPlacingOrder(false)
    }
  }

  // Filter and Search Logic
  const categories = ["All", ...new Set(menuItems.map(item => item.category || "Uncategorized"))]
  
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

  return (
    <>
      {/* Header */}
      <header className="dashboard-header">
        <div className="brand-section">
          <div className="logo-dot"></div>
          <h1 className="brand-title">MenuVerse <span>AI</span></h1>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="workspace-selector">
            <span className="status-dot-active"></span>
            <span>Local Mock Database Active</span>
          </div>
          
          <button 
            className="btn-secondary" 
            onClick={handlePlaceTestOrder}
            disabled={placingOrder}
            style={{ opacity: placingOrder ? 0.7 : 1 }}
          >
            {placingOrder ? "Placing..." : "⚡ Place Test Order"}
          </button>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add Menu Item
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="dashboard-container animate-fade-in">
        
        {/* Quick Stats Grid */}
        <section className="stats-grid">
          <div className="glass stat-card">
            <div className="stat-info">
              <h3>Menu Items</h3>
              <div className="stat-value">{loadingMenu ? "..." : menuItems.length}</div>
            </div>
            <div className="stat-icon-wrapper">🍽️</div>
          </div>

          <div className="glass stat-card">
            <div className="stat-info">
              <h3>Busiest Peak Hour</h3>
              <div className="stat-value" style={{ fontSize: "1.85rem", paddingTop: "5px" }}>{busiestHour}</div>
            </div>
            <div className="stat-icon-wrapper" style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--accent-amber)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>📈</div>
          </div>

          <div className="glass stat-card">
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <div className="stat-value">₹{loadingOrders ? "..." : totalRevenue}</div>
            </div>
            <div className="stat-icon-wrapper">💰</div>
          </div>
        </section>

        {/* Main Sections Grid */}
        <div className="main-dashboard-grid">
          
          {/* Left Column: Menu Manager */}
          <section className="glass">
            <div className="panel-header">
              <h2 className="panel-title">
                <span className="panel-title-icon">🍔</span> Menu Manager <span style={{fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "normal"}}>(Click card to log view)</span>
              </h2>
              <input
                type="text"
                placeholder="Search menu... "
                className="input-field"
                style={{ width: "220px", padding: "8px 14px", fontSize: "0.85rem" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <div className="tabs-container">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`tab-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            {loadingMenu ? (
              <div className="empty-state">Loading menu items...</div>
            ) : filteredMenuItems.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🍽️</span>
                <p>No menu items found. Add some using the button above!</p>
              </div>
            ) : (
              <div className="menu-grid">
                {filteredMenuItems.map(item => (
                  <div 
                    key={item.item_id} 
                    className="menu-card"
                    onClick={() => handleTrackView(item.item_id)}
                    style={{ 
                      cursor: "pointer", 
                      opacity: item.available === false ? 0.55 : 1,
                      position: "relative" 
                    }}
                  >
                    {item.image_url && (
                      <div className="menu-card-img-wrapper">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="menu-card-img" 
                        />
                        {item.available === false && (
                          <div style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: "rgba(0, 0, 0, 0.7)",
                            color: "var(--accent-pink)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.85rem",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "1px"
                          }}>
                            Sold Out
                          </div>
                        )}
                      </div>
                    )}
                    <div className="menu-card-header">
                      <span className="menu-card-cat">{item.category}</span>
                      <span className="menu-card-price">₹{item.price}</span>
                    </div>
                    <div>
                      <h4 className="menu-card-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {item.name}
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "normal" }}>
                          👁️ {item.views || 0}
                        </span>
                      </h4>
                      <p className="menu-card-desc">{item.description || "No description provided."}</p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "10px", marginTop: "4px" }}>
                      <span className="menu-card-id">{item.item_id}</span>
                      
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          className={`badge ${item.available !== false ? 'badge-ready' : 'badge-pending'}`}
                          onClick={(e) => handleToggleAvailability(e, item.item_id, item.available !== false)}
                          style={{ cursor: "pointer", display: "inline-block", background: "none" }}
                        >
                          {item.available !== false ? "Active" : "Sold Out"}
                        </button>
                        <button 
                          className="badge" 
                          onClick={(e) => handleDeleteItem(e, item.item_id)}
                          style={{ cursor: "pointer", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Column: Orders List */}
          <section className="glass">
            <div className="panel-header">
              <h2 className="panel-title">
                <span className="panel-title-icon">📋</span> Active Orders
              </h2>
            </div>

            {loadingOrders ? (
              <div className="empty-state">Loading active orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">📦</span>
                <p>No active orders placed yet. Click "Place Test Order" to simulate one!</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.order_id} className="order-row">
                    <div className="order-row-header">
                      <span className="order-customer">{order.customer_name}</span>
                      <span className="order-time">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="order-items-summary">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="order-item-line">
                          <span>{it.name} x {it.quantity}</span>
                          <span>₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-row-footer">
                      <span className="order-id">{order.order_id}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span className="order-total">₹{order.total_amount}</span>
                        <span className={`badge badge-${order.status?.toLowerCase() || 'pending'}`}>
                          {order.status || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Add/Edit Menu Item Modal Popup */}
      <div className={`modal-overlay ${isModalOpen ? "active" : ""}`}>
        <div className="glass modal-content">
          <div className="panel-header">
            <h3 className="panel-title">Add New Menu Item</h3>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ background: "transparent", color: "var(--text-secondary)", fontSize: "1.25rem", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="form-grid">
              
              <div className="form-group">
                <label htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  required
                  placeholder="e.g. Garlic Naan"
                  className="input-field"
                  value={formData.name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="form-row-double">
                <div className="form-group">
                  <label htmlFor="itemPrice">Price (₹)</label>
                  <input
                    type="number"
                    id="itemPrice"
                    required
                    placeholder="e.g. 180"
                    className="input-field"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="itemCategory">Category</label>
                  <select
                    id="itemCategory"
                    className="input-field"
                    style={{ appearance: "none", cursor: "pointer" }}
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Mains">Mains</option>
                    <option value="Starters">Starters</option>
                    <option value="Sides">Sides</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="itemId">Item ID (Identifier)</label>
                <input
                  type="text"
                  id="itemId"
                  required
                  placeholder="e.g. item_garlic_naan"
                  className="input-field"
                  value={formData.itemId}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemId: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="itemDesc">Description</label>
                <textarea
                  id="itemDesc"
                  placeholder="Tell us about the ingredients, taste..."
                  className="input-field"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submittingItem}
              >
                {submittingItem ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
