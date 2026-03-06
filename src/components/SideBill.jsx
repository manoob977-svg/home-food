import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { translations } from '../translations';

const SideBill = ({ isOpen, onClose, onOrderPlaced }) => {
    const { cart, removeFromCart, updateQty, calculateTotal, placeOrder, lang } = useCart();
    const t = translations[lang];
    const [customer, setCustomer] = useState({ name: '', phone: '', address: '', delivery: false });
    const [showForm, setShowForm] = useState(false);

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = subtotal * 0.05;
    const total = calculateTotal(cart, customer.delivery);

    const handlePlaceOrder = () => {
        if (!customer.name || !customer.phone) {
            alert(lang === 'ur' ? 'براہ کرم نام اور فون نمبر درج کریں۔' : 'Please enter name and phone number.');
            return;
        }
        if (customer.phone.length !== 11) {
            alert(t.invalidPhone);
            return;
        }
        const order = placeOrder(customer);
        onOrderPlaced(order);
        onClose();
        setShowForm(false);
        setCustomer({ name: '', phone: '', address: '', delivery: false });
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%',
            maxWidth: window.innerWidth < 768 ? '100%' : '450px',
            zIndex: 2000, backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', animation: 'slideIn 0.3s ease'
        }}>
            <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

            <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.5rem' }}>{t.cartTitle}</h3>
                <button onClick={onClose} style={{ fontSize: '1.5rem', background: 'none' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                {cart.length === 0 ? (
                    <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-light)' }}>{t.emptyCart}</p>
                ) : (
                    <>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <img src={item.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ fontSize: '1rem' }}>{item.name[lang]}</h5>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{item.price} {t.rupees}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button onClick={() => updateQty(item.id, -1)} className="glass" style={{ width: '30px', height: '30px', borderRadius: '50%' }}>-</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} className="glass" style={{ width: '30px', height: '30px', borderRadius: '50%' }}>+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--primary)', background: 'none', marginRight: '10px' }}>🗑</button>
                            </div>
                        ))}

                        <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '2px dashed #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{t.subtotal}</span>
                                <span>{subtotal} {t.rupees}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{t.tax}</span>
                                <span>{Math.round(tax)} {t.rupees}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={customer.delivery} onChange={e => setCustomer({ ...customer, delivery: e.target.checked })} />
                                    {t.deliveryFee}
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                                <span>{t.totalBill}</span>
                                <span>{Math.round(total)} {t.rupees}</span>
                            </div>
                        </div>

                        {showForm ? (
                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="text" placeholder={t.customerName} value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                                <input
                                    type="tel"
                                    placeholder={t.mobileNumber}
                                    value={customer.phone}
                                    maxLength={11}
                                    onChange={e => setCustomer({ ...customer, phone: e.target.value.replace(/[^0-9]/g, '') })}
                                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                />
                                <textarea placeholder={t.address} value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '80px' }} />
                                <button onClick={handlePlaceOrder} style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '15px', borderRadius: '10px', fontWeight: 600 }}>{t.completeOrder}</button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowForm(true)}
                                style={{
                                    width: '100%', backgroundColor: 'var(--primary)', color: 'white',
                                    padding: '15px', borderRadius: '10px', fontWeight: 600, marginTop: '2rem'
                                }}
                            >
                                {t.next}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SideBill;
