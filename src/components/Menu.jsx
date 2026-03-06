import React from 'react';
import { foodItems } from '../data';
import { useCart } from '../CartContext';
import { translations } from '../translations';

const Menu = () => {
    const { addToCart, lang } = useCart();
    const t = translations[lang];

    return (
        <div id="menu-section" style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', color: 'var(--text)' }}>{t.ourMenu}</h3>

            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {foodItems.map(item => (
                    <div key={item.id} className="glass" style={{
                        borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.3s ease'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ height: '180px', overflow: 'hidden' }}>
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{item.category[lang]}</p>
                                <p style={{ fontWeight: 700, color: 'var(--text)' }}>{item.price} {t.rupees}</p>
                            </div>
                            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.name[lang]}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.5rem', minHeight: '3em' }}>{item.description[lang]}</p>
                            <button
                                onClick={() => addToCart(item)}
                                style={{
                                    width: '100%', backgroundColor: 'var(--text)', color: 'white',
                                    padding: '10px', borderRadius: '10px', fontWeight: 600
                                }}
                            >
                                {t.addToCart}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
