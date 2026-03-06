import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [lang, setLang] = useState('ur'); // Default Urdu

    const toggleLang = () => {
        setLang(prev => (prev === 'ur' ? 'en' : 'ur'));
    };

    useEffect(() => {
        document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('home_food_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const addToCart = (item) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev.map((i) => {
                if (i.id === id) {
                    const newQty = Math.max(1, i.qty + delta);
                    return { ...i, qty: newQty };
                }
                return i;
            })
        );
    };

    const clearCart = () => setCart([]);

    const placeOrder = (customerDetails) => {
        const newOrder = {
            id: Date.now(),
            items: cart,
            total: calculateTotal(cart, customerDetails.delivery),
            customer: customerDetails,
            date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
        };
        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        localStorage.setItem('home_food_orders', JSON.stringify(updatedOrders));
        clearCart();
        return newOrder;
    };

    const calculateTotal = (items, isDelivery) => {
        const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const tax = subtotal * 0.05; // 5% tax
        const deliveryFee = isDelivery ? 150 : 0;
        return subtotal + tax + deliveryFee;
    };

    return (
        <CartContext.Provider value={{ lang, toggleLang, cart, addToCart, removeFromCart, updateQty, clearCart, placeOrder, orders, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};
