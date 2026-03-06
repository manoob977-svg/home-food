import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Menu from './components/Menu'
import SideBill from './components/SideBill'
import AdminDashboard from './components/AdminDashboard'
import BottomNav from './components/BottomNav'
import { CartProvider, useCart } from './CartContext'
import { translations } from './translations'

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)
  const { lang } = useCart();
  const t = translations[lang];

  const handleOrderComplete = (order) => {
    setLastOrder(order)
  }

  const closeThanks = () => setLastOrder(null)

  return (
    <div className="app-container">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        onAdminToggle={() => setIsAdminOpen(true)}
      />

      <Hero onScrollToMenu={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })} />

      <Menu />

      <SideBill
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={handleOrderComplete}
      />

      <BottomNav onCartOpen={() => setIsCartOpen(true)} />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {lastOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 4000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="glass" style={{
            padding: '3rem', borderRadius: '30px', textAlign: 'center', maxWidth: '500px', backgroundColor: 'var(--bg)'
          }}>
            <span style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block' }}>🎉</span>
            <h2 style={{ marginBottom: '1rem' }}>{t.thanks}, {lastOrder.customer.name}!</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-light)' }}>
              {t.orderReceived.replace('{phone}', lastOrder.customer.phone)}
            </p>
            <button onClick={closeThanks} style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '12px 30px', borderRadius: '15px' }}>{t.backToMenu}</button>
          </div>
        </div>
      )}

      <footer style={{
        padding: '4rem 5% 6rem 5%',
        backgroundColor: '#0f172a',
        color: 'white',
        borderRadius: '40px 40px 0 0',
        position: 'relative',
        marginTop: '4rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          textAlign: lang === 'ur' ? 'right' : 'left',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--primary)' }}>{t.appTitle}</h2>
            <p style={{ opacity: 0.8, fontSize: '0.95rem', maxWidth: '300px' }}>{t.footerSub}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>{lang === 'ur' ? 'روابط' : 'Links'}</h4>
            <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer', opacity: 0.7 }}>{lang === 'ur' ? 'ہوم' : 'Home'}</span>
            <span onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', opacity: 0.7 }}>{t.ourMenu}</span>
          </div>

          <div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>{lang === 'ur' ? 'رابطہ کریں' : 'Contact'}</h4>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>📍 {lang === 'ur' ? 'پاکستان' : 'Pakistan'}</p>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>📞 0300 0000000</p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>
            {t.footerRights}
          </div>

          <button
            onClick={() => setIsAdminOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.75rem',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: '0.3s',
              zIndex: 1100 // Well above BottomNav (1000)
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
          >
            ⚙️ {t.admin}
          </button>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

export default App
