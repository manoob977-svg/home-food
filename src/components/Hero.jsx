import React from 'react';
import { useCart } from '../CartContext';
import { translations } from '../translations';

const Hero = ({ onScrollToMenu }) => {
    const { lang } = useCart();
    const t = translations[lang];

    return (
        <div style={{
            minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', textAlign: 'center', padding: '2rem 5%',
            background: 'linear-gradient(rgba(29, 53, 87, 0.6), rgba(29, 53, 87, 0.6)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200") no-repeat center/cover',
            marginTop: '70px', borderRadius: '0 0 40px 40px', color: 'white'
        }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 8vw, 3.5rem)', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>{t.heroTitle}</h2>
            <p style={{ fontSize: 'clamp(0.9rem, 4vw, 1.2rem)', marginBottom: '2rem', maxWidth: '600px', opacity: 0.9 }}>
                {t.heroSub}
            </p>
            <button onClick={onScrollToMenu} style={{
                backgroundColor: 'var(--primary)', color: 'white', padding: '12px 30px',
                borderRadius: '30px', fontSize: '1rem', fontWeight: 600,
                boxShadow: '0 10px 20px rgba(230, 57, 70, 0.3)'
            }}>
                {t.viewMenu}
            </button>
        </div>
    );
};

export default Hero;
