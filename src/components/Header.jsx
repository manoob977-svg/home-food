import React from 'react';
import { useCart } from '../CartContext';
import { translations } from '../translations';
import logo from '../assets/logo.png';

const Header = ({ onCartOpen, onAdminToggle }) => {
    const { cart, lang, toggleLang } = useCart();
    const t = translations[lang];
    const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

    return (
        <nav className="glass" style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.5rem 5%', height: '70px', borderRadius: '0 0 15px 15px'
        }}>
            <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
            >
                <img src={logo} alt="Home Food Logo" style={{ height: '50px', width: 'auto', borderRadius: '8px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
                    <h1 style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>{t.appTitle}</h1>
                    <div style={{ display: 'flex', gap: '8px', color: 'var(--text-light)', fontSize: '0.7rem' }}>
                        <span onClick={(e) => { e.stopPropagation(); toggleLang(); }} style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}>{t.langSwitch}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="desktop-only" style={{ display: 'flex', gap: '10px' }}>
                    <a href="tel:03000000000" className="glass" style={{
                        padding: '8px 15px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600,
                        border: '1px solid var(--primary-dark)44', textDecoration: 'none'
                    }}>
                        {t.instantOrder}
                    </a>
                    <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" className="glass" style={{
                        padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', color: '#25D366', fontWeight: 600,
                        border: '1px solid #25D36644'
                    }}>
                        {t.whatsapp}
                    </a>
                </div>
                <div onClick={onCartOpen} style={{ position: 'relative', cursor: 'pointer', padding: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🛒</span>
                    {cartCount > 0 && (
                        <span style={{
                            position: 'absolute', top: '-5px', right: '-10px',
                            background: 'var(--primary)', color: 'white', fontSize: '0.7rem',
                            padding: '2px 6px', borderRadius: '10px', fontWeight: 700
                        }}>
                            {cartCount}
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
