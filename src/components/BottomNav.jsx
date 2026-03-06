import React from 'react';
import { useCart } from '../CartContext';
import { translations } from '../translations';

const BottomNav = ({ onCartOpen }) => {
    const { lang } = useCart();
    const t = translations[lang];

    return (
        <div className="glass mobile-only bottom-nav">
            <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-item">
                <span className="nav-icon">🏠</span>
                <span>{lang === 'ur' ? 'ہوم' : 'Home'}</span>
            </div>
            <div onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })} className="nav-item">
                <span className="nav-icon">📜</span>
                <span>{t.ourMenu}</span>
            </div>
            <div onClick={onCartOpen} className="nav-item">
                <span className="nav-icon">🛒</span>
                <span>{t.cartTitle}</span>
            </div>
            <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" className="nav-item">
                <span className="nav-icon">💬</span>
                <span>WhatsApp</span>
            </a>
            <a href="tel:03000000000" className="nav-item">
                <span className="nav-icon">📞</span>
                <span>{lang === 'ur' ? 'کال' : 'Call'}</span>
            </a>
        </div>
    );
};

export default BottomNav;
