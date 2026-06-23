'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { CartItem, MenuItem, Order } from './types'

// === CART CONTEXT ===
interface CartContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem, qty?: number) => void
  updateQty: (itemId: string, qty: number) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  cartCount: number
  subtotal: number
  orders: Order[]
  placeOrder: () => Order | null
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // Load orders from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('menuverse_orders')
    if (saved) {
      try {
        setOrders(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse orders from localStorage')
      }
    }
  }, [])

  const addToCart = useCallback((item: MenuItem, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.item_id === item.item_id)
      if (existing) return prev.map(c => c.item.item_id === item.item_id ? { ...c, quantity: c.quantity + qty } : c)
      return [...prev, { item, quantity: qty }]
    })
  }, [])

  const updateQty = useCallback((itemId: string, qty: number) => {
    setCart(prev => qty <= 0 ? prev.filter(c => c.item.item_id !== itemId) : prev.map(c => c.item.item_id === itemId ? { ...c, quantity: qty } : c))
  }, [])

  const removeFromCart = useCallback((itemId: string) => setCart(prev => prev.filter(c => c.item.item_id !== itemId)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)
  const subtotal = cart.reduce((s, c) => s + c.item.price * c.quantity, 0)

  const placeOrder = useCallback(() => {
    if (cart.length === 0) return null

    const newOrder: Order = {
      order_id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...cart],
      total: subtotal,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      prep_time_estimate: 15,
    }

    setOrders(prev => {
      const updated = [newOrder, ...prev]
      localStorage.setItem('menuverse_orders', JSON.stringify(updated))
      return updated
    })
    setCart([])
    return newOrder
  }, [cart, subtotal])

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartCount, subtotal, orders, placeOrder }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

// === I18N CONTEXT ===
interface I18nContextType {
  lang: string
  setLang: (code: string) => void
  t: (text: string) => string
  translateMenuItem: (itemId: string, name: string, description: string) => { name: string; description: string }
}

const I18nContext = createContext<I18nContextType>({ 
  lang: 'en', 
  setLang: () => {}, 
  t: (text) => text,
  translateMenuItem: (itemId: string, name: string, description: string) => ({ name, description })
})

const MENU_TRANSLATIONS: Record<string, Record<string, { name: string; description: string }>> = {
  es: {
    'd1': { name: 'Pollo Mantequilla', description: 'Pollo tierno en una rica salsa cremosa de tomate y mantequilla con especias aromáticas.' },
    'd2': { name: 'Pizza Margarita', description: 'Pizza napolitana clásica con tomates San Marzano, mozzarella fresca y albahaca.' },
    'd3': { name: 'Bandeja de Sushi', description: "Selección del chef de 12 nigiri y maki premium con wasabi." },
    'd4': { name: 'Ensalada César', description: 'Lechuga romana crujiente con aderezo César casero, parmesano y crutones.' },
    'd5': { name: 'Pastel de Chocolate', description: 'Pastel de chocolate tibio con centro fundido, servido con helado de vainilla.' },
    'd6': { name: 'Hamburguesa Trufa', description: 'Hamburguesa de carne premium con alioli de trufa, cheddar añejo y cebollas caramelizadas.' },
    'd7': { name: 'Pollo Tikka Masala', description: 'Pollo marinado en una salsa de curry cremosa y especiada con arroz basmati.' },
    'd8': { name: 'Lassi de Mango', description: 'Bebida refrescante de yogur con mango y un toque de cardamomo.' },
    'd9': { name: 'Té Helado', description: 'Té helado recién preparado con un toque de limón.' },
  },
  fr: {
    'd1': { name: 'Poulet au Beurre', description: 'Poulet tendre dans une sauce crémeuse riche à la tomate et au beurre avec des épices aromatiques.' },
    'd2': { name: 'Pizza Marguerite', description: 'Pizza napolitaine classique avec tomates San Marzano, mozzarella fraîche et basilic.' },
    'd3': { name: 'Plateau de Sushi', description: "Sélection du chef de 12 nigiri et makis premium avec wasabi." },
    'd4': { name: 'Salade César', description: 'Laitue romaine croustillante avec vinaigrette César maison, parmesan et croûtons.' },
    'd5': { name: 'Fondant au Chocolat', description: 'Gâteau au chocolat chaud avec un cœur fondant, servi avec glace à la vanille.' },
    'd6': { name: 'Burger à la Truffe', description: 'Steak haché premium avec aïoli à la truffe, cheddar affiné et oignons caramélisés.' },
    'd7': { name: 'Poulet Tikka Masala', description: 'Poulet mariné dans une sauce de curry épicée et crémeuse avec riz basmati.' },
    'd8': { name: 'Lassi à la Mangue', description: 'Boisson rafraîchissante à base de yaourt avec mangue et une touche de cardamome.' },
    'd9': { name: 'Thé Glacé', description: 'Thé glacé fraîchement préparé avec un zeste de citron.' },
  },
  hi: {
    'd1': { name: 'बटर चिकन', description: 'सुगंधित मसालों के साथ एक रिच, क्रीमी टमाटर-मक्खन सॉस में कोमल चिकन।' },
    'd2': { name: 'मार्गेरिटा पिज़्ज़ा', description: 'सैन मार्ज़ानो टमाटर, ताज़ा मोज़ारेला और तुलसी के साथ क्लासिक नियोपोलिटन पिज़्ज़ा।' },
    'd3': { name: 'सुशी प्लेटर', description: 'वसाबी के साथ 12 प्रीमियम निगिरी और मकी रोल्स का चेफ का चयन।' },
    'd4': { name: 'सीज़र सलाद', description: 'हाउस-मेड सीज़र ड्रेसिंग, पारमेसन और क्रूटन के साथ कुरकुरा रोमेन लेट्यूस।' },
    'd5': { name: 'चॉकलेट लावा केक', description: 'वेनिला बीन आइसक्रीम के साथ परोसा जाने वाला मोल्डन सेंटर के साथ गर्म चॉकलेट केक।' },
    'd6': { name: 'ट्रफल बर्गर', description: 'ट्रफल ऑलियो, एज्ड चेडर और कैरमेलाइज्ड प्याज के साथ प्रीमियम बीफ पैटी।' },
    'd7': { name: 'चिकन टिक्का मसाला', description: 'बासमती चावल के साथ मसालेदार, क्रीमी करी सॉस में मैरिनेटेड चिकन।' },
    'd8': { name: 'मैंगो लस्सी', description: 'इलायची के साथ ताज़ा दही-आधारी मैंगो ड्रिंक।' },
    'd9': { name: 'आइस्ड टी', description: 'नींबू के साथ ताज़ा ब्रू किया हुआ आइस्ड टी।' },
  },
  ar: {
    'd1': { name: 'دجاج بالزبدة', description: 'دجاج طري في صوص طماطم غني بالزبدة والكريمة مع بهارات عطرية.' },
    'd2': { name: 'بيتزا مارغريتا', description: 'بيتزا نابولية كلاسيكية مع طماطم سان مارزانو، موزاريلا طازجة وريحان.' },
    'd3': { name: 'طبق سوشي', description: 'اختيار الشيف من 12 نيجيري وماكي بريميوم مع واتسابي.' },
    'd4': { name: 'سلطة سيزر', description: 'خس روماني مقرمش مع تتبيلة سيزر محلية الصنع، بارميزان وكراوتون.' },
    'd5': { name: 'كيكة الشوكولاتة', description: 'كيكة شوكولاتة دافئة مع قلب سائل، تقدم مع آيس كريم فانيليا.' },
    'd6': { name: 'برغر الكمأة', description: 'لحم بقري بريميوم مع أيولي الكمأة، جبنة تشيدار متقدمة وبصل مكرمل.' },
    'd7': { name: 'دجاج تيكا ماسالا', description: 'دجاج متبيل في صوص كاري كريمي حار مع أرز بسمتي.' },
    'd8': { name: 'لاسي المانجو', description: 'مشروب منعش على أساس الزبادي مع المانجو ولمسة من الهيل.' },
    'd9': { name: 'شاي مثلج', description: 'شاي مثلج طازج التحضير مع لمسة من الليمون.' },
  },
  zh: {
    'd1': { name: '黄油鸡', description: '嫩鸡肉配以浓郁的番茄黄油酱和芳香香料。' },
    'd2': { name: '玛格丽特披萨', description: '经典那不勒斯披萨，配圣马扎诺番茄、新鲜马苏里拉奶酪和罗勒。' },
    'd3': { name: '寿司拼盘', description: '厨师精选12件优质握寿司和卷寿司，配山葵。' },
    'd4': { name: '凯撒沙拉', description: '脆生罗马生菜配自制凯撒酱、帕尔马干酪和面包丁。' },
    'd5': { name: '巧克力熔岩蛋糕', description: '温暖的巧克力蛋糕，中心熔融，配香草冰淇淋。' },
    'd6': { name: '松露汉堡', description: '优质牛肉饼配松露蛋黄酱、陈年切达干酪和焦糖洋葱。' },
    'd7': { name: '印度黄油鸡咖喱', description: '腌制鸡肉配香辣奶油咖喱酱和巴斯马蒂米饭。' },
    'd8': { name: '芒果拉西', description: '清爽的酸奶饮料，配芒果和豆蔻。' },
    'd9': { name: '冰茶', description: ' freshly brewed 冰茶，配柠檬。' },
  },
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: { 
    'Taste. Order. Delight.': 'Saborea. Pide. Disfruta.', 
    "I'm a Diner": 'Soy un Comensal', 
    "I'm an Owner": 'Soy un Dueño', 
    'Scan your table QR': 'Escanea tu QR de mesa', 
    'Open demo menu directly': 'Abrir menú demo', 
    'All Dishes': 'Todos los Platos', 
    'Add to Order': 'Agregar al Pedido',
    'Size': 'Tamaño',
    'Build Your Meal': 'Arma tu Comida',
    'Extra Cheese': 'Queso Extra',
    'Avocado': 'Aguacate',
    'Bacon': 'Tocino',
    'Jalapeños': 'Jalapeños',
    'Ingredients': 'Ingredientes',
    'Allergens': 'Alérgenos',
    'Contains': 'Contiene',
    'No major allergens listed': 'Sin alérgenos importantes',
    'Recommended Pairings': 'Acompañamientos Recomendados',
    'TRENDING': 'TENDENCIA',
    'BESTSELLER': 'MÁS VENDIDO',
    'FAVOURITE': 'FAVORITO',
    'CHEF SPECIAL': 'ESPECIAL DEL CHEF',
    'SPICY': 'PICANTE',
    'LIGHT HEALTHY': 'LIGERO Y SALUDABLE',
    "TODAY'S FEATURE": 'DESTACADO DE HOY',
    'View details': 'Ver detalles',
    'Indian': 'Indio',
    'Italian': 'Italiano',
    'Japanese': 'Japonés',
    'American': 'Americano',
    'Salads': 'Ensaladas',
    'Desserts': 'Postres',
    'Drinks': 'Bebidas',
    'Order Confirmed!': '¡Pedido confirmado!',
    'Sit back — your kitchen is already on it.': 'Relájate — la cocina ya se encargó.',
    'ESTIMATED PREP TIME': 'TIEMPO DE PREPARACIÓN ESTIMADO',
    'LIVE STATUS': 'ESTADO EN VIVO',
    'Order Confirmed': 'Pedido Confirmado',
    "We've received your order": 'Hemos recibido tu pedido',
    'Being Prepared': 'Siendo Preparado',
    'The kitchen is on it': 'La cocina se encargó',
    'Ready to Serve': 'Listo para Servir',
    'Your food is on its way': 'Tu comida está en camino',
    'YOUR ORDER': 'TU PEDIDO',
    'Total': 'Total',
    'Order Something Else': 'Pedir Otra Cosa',
    'Your Order': 'Tu Pedido',
    'item(s)': 'artículo(s)',
    'Your order is empty': 'Tu pedido está vacío',
    'Add a dish to get started': 'Agrega un plato para comenzar',
    'Place Order': 'Hacer Pedido',
    'Promo code': 'Código promocional',
    'Apply': 'Aplicar',
    'How would you like to': 'Cómo te gustaría',
    'start?': 'comenzar?',
    'Choose an option below to begin your dining experience': 'Elige una opción a continuación para comenzar tu experiencia gastronómica',
    'Scan Table QR': 'Escanear QR de Mesa',
    'Already at a restaurant? Scan the code on your table to order.': 'Ya estás en un restaurante? Escanea el código en tu mesa para ordenar.',
    'Browse Restaurants Near Me': 'Explorar Restaurantes Cerca de Mí', 
    'Not at a table yet? Explore restaurants near your location.': 'Aún no estás en una mesa? Explora restaurantes cerca de tu ubicación.',
    'AI-powered restaurant OS that turns every table into a cinematic dining experience.': 'Sistema operativo de restaurantes con IA que convierte cada mesa en una experiencia gastronómica cinematográfica.',
    'Orders': 'Pedidos',
    'View and manage incoming orders in real-time.': 'Ver y gestionar pedidos entrantes en tiempo real.',
    'Order ID': 'ID de Pedido',
    'Table / Info': 'Mesa / Info',
    'Items': 'Artículos',
    'Amount': 'Monto',
    'Status': 'Estado',
    'Time': 'Hora',
    'pending': 'pendiente',
    'preparing': 'preparando',
    'ready': 'listo',
    'completed': 'completado',
    'Back to Menu': 'Volver al Menú',
    'Map View': 'Vista del Mapa',
    'Hide': 'Ocultar',
    'View': 'Ver',
    'km away': 'km de distancia',
    'SIGNATURE DISH': 'PLATO FIRME',
    'View Menu': 'Ver Menú',
    'Scan QR Code': 'Escanear Código QR',
    'Browse menus near you': 'Explorar menús cerca de ti',
    'or': 'o',
    'No items': 'Sin artículos',
  },
  fr: { 
    'Taste. Order. Delight.': 'Goûtez. Commandez. Savourez.', 
    "I'm a Diner": 'Je suis un Convive', 
    "I'm an Owner": 'Je suis un Propriétaire', 
    'Scan your table QR': 'Scannez le QR de votre table', 
    'Open demo menu directly': 'Ouvrir le menu démo', 
    'All Dishes': 'Tous les Plats', 
    'Add to Order': 'Ajouter à la Commande',
    'Order Confirmed!': 'Commande confirmée!',
    'Sit back — your kitchen is already on it.': 'Installez-vous — la cuisine s\'en charge.',
    'ESTIMATED PREP TIME': 'TEMPS DE PRÉPARATION ESTIMÉ',
    'LIVE STATUS': 'STATUT EN DIRECT',
    'Order Confirmed': 'Commande Confirmée',
    "We've received your order": 'Nous avons reçu votre commande',
    'Being Prepared': 'En Préparation',
    'The kitchen is on it': 'La cuisine s\'en charge',
    'Ready to Serve': 'Prêt à Servir',
    'Your food is on its way': 'Votre nourriture arrive',
    'YOUR ORDER': 'VOTRE COMMANDE',
    'Total': 'Total',
    'Order Something Else': 'Commander Autre Chose',
    'Your Order': 'Votre Commande',
    'item(s)': 'article(s)',
    'Your order is empty': 'Votre commande est vide',
    'Add a dish to get started': 'Ajoutez un plat pour commencer',
    'Place Order': 'Commander',
    'Promo code': 'Code promo',
    'Apply': 'Appliquer',
    'How would you like to': 'Comment aimeriez-vous',
    'start?': 'commencer?',
    'Choose an option below to begin your dining experience': 'Choisissez une option ci-dessous pour commencer votre expérience culinaire',
    'Scan Table QR': 'Scanner QR de Table',
    'Already at a restaurant? Scan the code on your table to order.': 'Déjà dans un restaurant? Scannez le code sur votre table pour commander.',
    'Browse Restaurants Near Me': 'Parcourir les Restaurants Près de Moi', 
    'Not at a table yet? Explore restaurants near your location.': 'Pas encore à table? Explorez les restaurants près de votre position.',
    'AI-powered restaurant OS that turns every table into a cinematic dining experience.': 'Système d\'exploitation de restaurant alimenté par l\'IA qui transforme chaque table en une expérience culinaire cinématographique.',
    'Orders': 'Commandes',
    'View and manage incoming orders in real-time.': 'Voir et gérer les commandes entrantes en temps réel.',
    'Order ID': 'ID de Commande',
    'Table / Info': 'Table / Info',
    'Items': 'Articles',
    'Amount': 'Montant',
    'Status': 'Statut',
    'Time': 'Heure',
    'pending': 'en attente',
    'preparing': 'en préparation',
    'ready': 'prêt',
    'completed': 'terminé',
    'Back to Menu': 'Retour au Menu',
    'Map View': 'Vue Carte',
    'Hide': 'Masquer',
    'View': 'Voir',
    'km away': 'km de distance',
    'SIGNATURE DISH': 'PLAT SIGNATURE',
    'View Menu': 'Voir Menu',
    'Scan QR Code': 'Scanner Code QR',
    'Browse menus near you': 'Parcourir les menus près de chez vous',
    'or': 'ou',
    'No items': 'Aucun article',
  },
  hi: { 
    'Taste. Order. Delight.': 'स्वाद लें। ऑर्डर करें। आनंद लें।', 
    "I'm a Diner": 'मैं एक ग्राहक हूं', 
    "I'm an Owner": 'मैं एक मालिक हूं', 
    'Scan your table QR': 'अपना टेबल QR स्कैन करें', 
    'Open demo menu directly': 'डेमो मेन्यू खोलें', 
    'All Dishes': 'सभी व्यंजन', 
    'Add to Order': 'ऑर्डर में जोड़ें',
    'Order Confirmed!': 'ऑर्डर की पुष्टि!',
    'Sit back — your kitchen is already on it.': 'आराम करें — आपका खाना तैयार हो रहा है।',
    'ESTIMATED PREP TIME': 'अनुमानित तैयारी का समय',
    'LIVE STATUS': 'लाइव स्टेटस',
    'Order Confirmed': 'ऑर्डर की पुष्टि',
    "We've received your order": 'हमें आपका ऑर्डर मिल गया है',
    'Being Prepared': 'तैयार किया जा रहा है',
    'The kitchen is on it': 'रसोई पर काम हो रहा है',
    'Ready to Serve': 'सर्व करने के लिए तैयार',
    'Your food is on its way': 'आपका खाना आ रहा है',
    'YOUR ORDER': 'आपका ऑर्डर',
    'Total': 'कुल',
    'Order Something Else': 'कुछ और ऑर्डर करें',
    'Your Order': 'आपका ऑर्डर',
    'item(s)': 'वस्तु',
    'Your order is empty': 'आपका ऑर्डर खाली है',
    'Add a dish to get started': 'शुरुआत करने के लिए एक व्यंजन जोड़ें',
    'Place Order': 'ऑर्डर करें',
    'Promo code': 'प्रोमो कोड',
    'Apply': 'लागू करें',
    'How would you like to': 'आप कैसे शुरुआत करना चाहेंगे',
    'start?': 'शुरुआत करना चाहेंगे?',
    'Choose an option below to begin your dining experience': 'अपने खाने का अनुभव शुरू करने के लिए नीचे एक विकल्प चुनें',
    'Scan Table QR': 'टेबल QR स्कैन करें',
    'Already at a restaurant? Scan the code on your table to order.': 'पहले से ही रेस्तरां में हैं? ऑर्डर करने के लिए अपने टेबल पर कोड स्कैन करें।',
    'Browse Restaurants Near Me': 'मेरे पास रेस्तरां ब्राउज़ करें', 
    'Not at a table yet? Explore restaurants near your location.': 'अभी टेबल पर नहीं हैं? अपने स्थान के पास रेस्तरां खोजें।',
    'AI-powered restaurant OS that turns every table into a cinematic dining experience.': 'AI-संचालित रेस्तरां ऑपरेटिंग सिस्टम जो हर टेबल को एक सिनेमाई खाने का अनुभव बनाता है।',
    'Orders': 'ऑर्डर',
    'View and manage incoming orders in real-time.': 'आने वाले ऑर्डर को रीयल-टाइम में देखें और प्रबंधित करें।',
    'Order ID': 'ऑर्डर आईडी',
    'Table / Info': 'टेबल / जानकारी',
    'Items': 'वस्तुएं',
    'Amount': 'राशि',
    'Status': 'स्थिति',
    'Time': 'समय',
    'pending': 'लंबित',
    'preparing': 'तैयार हो रहा है',
    'ready': 'तैयार',
    'completed': 'पूर्ण',
    'Back to Menu': 'मेनू पर वापस जाएं',
    'Map View': 'मानचित्र दृश्य',
    'Hide': 'छिपाएं',
    'View': 'देखें',
    'km away': 'किमी दूर',
    'SIGNATURE DISH': 'सिग्नेचर डिश',
    'View Menu': 'मेनू देखें',
    'Scan QR Code': 'QR कोड स्कैन करें',
    'Browse menus near you': 'आपके पास के मेनू ब्राउज़ करें',
    'or': 'या',
    'No items': 'कोई सामान नहीं',
  },
  ar: { 
    'Taste. Order. Delight.': 'تذوق. اطلب. استمتع.', 
    "I'm a Diner": 'أنا زبون', 
    "I'm an Owner": 'أنا مالك', 
    'Scan your table QR': 'امسح QR الطاولة', 
    'Open demo menu directly': 'افتح القائمة التجريبية', 
    'All Dishes': 'جميع الأطباق', 
    'Add to Order': 'أضف إلى الطلب',
    'Order Confirmed!': 'تم تأكيد الطلب!',
    'Sit back — your kitchen is already on it.': 'استرخِ — المطبخ يعمل على طلبك.',
    'ESTIMATED PREP TIME': 'وقت التحضير المقدر',
    'LIVE STATUS': 'الحالة المباشرة',
    'Order Confirmed': 'تم تأكيد الطلب',
    "We've received your order": 'لقد استلمنا طلبك',
    'Being Prepared': 'يتم التحضير',
    'The kitchen is on it': 'المطبخ يعمل على ذلك',
    'Ready to Serve': 'جاهز للتقديم',
    'Your food is on its way': 'طعامك في الطريق',
    'YOUR ORDER': 'طلبك',
    'Total': 'المجموع',
    'Order Something Else': 'اطلب شيئًا آخر',
    'Your Order': 'طلبك',
    'item(s)': 'عنصر',
    'Your order is empty': 'طلبك فارغ',
    'Add a dish to get started': 'أضف طبقًا للبدء',
    'Place Order': 'إرسال الطلب',
    'Promo code': 'رمز ترويجي',
    'Apply': 'تطبيق',
    'How would you like to': 'كيف تريد',
    'start?': 'البدء?',
    'Choose an option below to begin your dining experience': 'اختر خيارًا أدناه لبدء تجربة تناول الطعام الخاصة بك',
    'Scan Table QR': 'مسح QR الطاولة',
    'Already at a restaurant? Scan the code on your table to order.': 'في مطعم بالفعل؟ امسح الرمز على طاولتك للطلب.',
    'Browse Restaurants Near Me': 'تصفح المطاعم القريبة مني', 
    'Not at a table yet? Explore restaurants near your location.': 'لم تجلس بعد؟ استكشف المطاعم القريبة من موقعك.',
    'AI-powered restaurant OS that turns every table into a cinematic dining experience.': 'نظام تشغيل المطاعم المدعوم بالذكاء الاصطناعي يحول كل طاولة إلى تجربة طعام سينمائية.',
    'Orders': 'الطلبات',
    'View and manage incoming orders in real-time.': 'عرض وإدارة الطلبات الواردة في الوقت الفعلي.',
    'Order ID': 'رقم الطلب',
    'Table / Info': 'الطاولة / معلومات',
    'Items': 'العناصر',
    'Amount': 'المبلغ',
    'Status': 'الحالة',
    'Time': 'الوقت',
    'pending': 'قيد الانتظار',
    'preparing': 'قيد التحضير',
    'ready': 'جاهز',
    'completed': 'مكتمل',
    'Back to Menu': 'العودة إلى القائمة',
    'Map View': 'عرض الخريطة',
    'Hide': 'إخفاء',
    'View': 'عرض',
    'km away': 'كم بعيد',
    'SIGNATURE DISH': 'الطبق المميز',
    'View Menu': 'عرض القائمة',
    'Scan QR Code': 'مسح رمز QR',
    'Browse menus near you': 'تصفح القوائم القريبة منك',
    'or': 'أو',
    'No items': 'لا توجد عناصر',
  },
  zh: { 
    'Taste. Order. Delight.': '品尝。下单。享受。', 
    "I'm a Diner": '我是食客', 
    "I'm an Owner": '我是店主', 
    'Scan your table QR': '扫描您桌子的二维码', 
    'Open demo menu directly': '直接打开演示菜单', 
    'All Dishes': '所有菜品', 
    'Add to Order': '添加到订单',
    'Order Confirmed!': '订单已确认！',
    'Sit back — your kitchen is already on it.': '请坐好 — 厨房正在为您准备。',
    'ESTIMATED PREP TIME': '预计准备时间',
    'LIVE STATUS': '实时状态',
    'Order Confirmed': '订单已确认',
    "We've received your order": '我们已收到您的订单',
    'Being Prepared': '正在准备',
    'The kitchen is on it': '厨房正在处理',
    'Ready to Serve': '准备上菜',
    'Your food is on its way': '您的食物即将送达',
    'YOUR ORDER': '您的订单',
    'Total': '总计',
    'Order Something Else': '再点其他菜品',
    'Your Order': '您的订单',
    'item(s)': '件',
    'Your order is empty': '您的订单是空的',
    'Add a dish to get started': '添加菜品开始点餐',
    'Place Order': '下单',
    'Promo code': '优惠码',
    'Apply': '应用',
    'How would you like to': '您想如何',
    'start?': '开始?',
    'Choose an option below to begin your dining experience': '选择下面的选项开始您的用餐体验',
    'Scan Table QR': '扫描餐桌二维码',
    'Already at a restaurant? Scan the code on your table to order.': '已经在餐厅了？扫描桌上的二维码点餐。',
    'Browse Restaurants Near Me': '浏览附近的餐厅', 
    'Not at a table yet? Explore restaurants near your location.': '还没入座？探索您附近的餐厅。',
    'AI-powered restaurant OS that turns every table into a cinematic dining experience.': 'AI驱动的餐厅操作系统，将每张餐桌变成电影般的用餐体验。',
    'Orders': '订单',
    'View and manage incoming orders in real-time.': '实时查看和管理 incoming 订单。',
    'Order ID': '订单号',
    'Table / Info': '桌号 / 信息',
    'Items': '菜品',
    'Amount': '金额',
    'Status': '状态',
    'Time': '时间',
    'pending': '待处理',
    'preparing': '准备中',
    'ready': '就绪',
    'completed': '已完成',
    'Back to Menu': '返回菜单',
    'Map View': '地图视图',
    'Hide': '隐藏',
    'View': '查看',
    'km away': '公里外',
    'SIGNATURE DISH': '招牌菜',
    'View Menu': '查看菜单',
    'Scan QR Code': '扫描二维码',
    'Browse menus near you': '浏览附近的菜单',
    'or': '或',
    'No items': '没有商品',
  },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState('en')

  // Persist language preference
  useEffect(() => {
    const saved = localStorage.getItem('menuverse_lang')
    if (saved && ['en', 'es', 'fr', 'hi', 'ar', 'zh'].includes(saved)) {
      setLang(saved)
    }
  }, [])

  const changeLang = useCallback((code: string) => {
    setLang(code)
    localStorage.setItem('menuverse_lang', code)
  }, [])

  const t = useCallback((text: string) => {
    if (lang === 'en') return text
    return TRANSLATIONS[lang]?.[text] || text
  }, [lang])

  const translateMenuItem = useCallback((itemId: string, name: string, description: string) => {
    if (lang === 'en') return { name, description }
    const menuTrans = MENU_TRANSLATIONS[lang]?.[itemId]
    if (menuTrans) return menuTrans
    return { name, description }
  }, [lang])

  return <I18nContext.Provider value={{ lang, setLang: changeLang, t, translateMenuItem }}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)

// === TOAST CONTEXT ===
interface ToastContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, background: 'white', borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.15)', borderLeft: `4px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#F5A623'}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, maxWidth: 360 }}>
          <span style={{ fontSize: 18 }}>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : 'ℹ'}</span>
          <span style={{ fontSize: 14, color: '#1a1a1a', flex: 1 }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 16 }}>✕</button>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)