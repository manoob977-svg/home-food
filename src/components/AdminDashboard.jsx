import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { translations } from '../translations';

const AdminDashboard = ({ isOpen, onClose }) => {
    const { orders, lang } = useCart();
    const t = translations[lang];
    const [activeTab, setActiveTab] = useState('orders');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');

    // Security States
    const [savedPassword, setSavedPassword] = useState('1234');
    const [savedRecoveryKey, setSavedRecoveryKey] = useState('HOME786');
    const [showForgot, setShowForgot] = useState(false);
    const [recoveryInput, setRecoveryInput] = useState('');

    // Settings States
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [newRecovery, setNewRecovery] = useState('');

    useEffect(() => {
        const storedPass = localStorage.getItem('adminPassword');
        const storedRecovery = localStorage.getItem('adminRecovery');
        if (storedPass) setSavedPassword(storedPass);
        if (storedRecovery) setSavedRecoveryKey(storedRecovery);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setIsAuthenticated(false);
            setPasswordInput('');
            setError('');
            setShowForgot(false);
            setRecoveryInput('');
        }
    }, [isOpen]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === savedPassword) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError(t.wrongPassword);
            setPasswordInput('');
        }
    };

    const handleRecovery = (e) => {
        e.preventDefault();
        if (recoveryInput === savedRecoveryKey) {
            setIsAuthenticated(true);
            setShowForgot(false);
            setRecoveryInput('');
            setError('');
            alert(lang === 'ur' ? 'ریکوری کامیاب! براہ کرم سیٹنگز میں جا کر نیا پاس ورڈ سیٹ کریں۔' : 'Recovery successful! Please set a new password in Settings.');
        } else {
            setError(t.invalidRecoveryKey);
        }
    };

    const handleUpdateSettings = (e) => {
        e.preventDefault();
        if (currentPass !== savedPassword) {
            alert(t.wrongPassword);
            return;
        }
        if (newPass && newPass !== confirmPass) {
            alert(t.passwordMismatch);
            return;
        }

        if (newPass) {
            localStorage.setItem('adminPassword', newPass);
            setSavedPassword(newPass);
        }
        if (newRecovery) {
            localStorage.setItem('adminRecovery', newRecovery);
            setSavedRecoveryKey(newRecovery);
        }

        alert(t.passwordChanged);
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setNewRecovery('');
    };

    const exportToCSV = () => {
        const headers = ["Date", "Customer", "Phone", "Address", "Items", "Total"];
        const rows = orders.map(o => [
            `"${o.date.replace(/"/g, '""')}"`,
            `"${o.customer.name.replace(/"/g, '""')}"`,
            `"${o.customer.phone.replace(/"/g, '""')}"`,
            `"${(o.customer.address || '').replace(/"/g, '""')}"`,
            `"${o.items.map(i => `${i.name[lang]} (x${i.qty})`).join(', ')}"`,
            `"${o.total}"`
        ]);

        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `home_food_orders_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert(t.exportDone);
    };

    const sendWhatsApp = (phone) => {
        const message = lang === 'ur' ?
            "السلام علیکم! ہوم فوڈ کی طرف سے نئی ریسیپی اور ڈیلز کی معلومات کے لیے ہم سے جڑے رہیں۔" :
            "Assalam-o-Alaikum! Stay connected with Home Food for new recipes and deals.";
        window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const getCustomers = () => {
        const customersMap = new Map();
        orders.forEach(order => {
            const phone = order.customer.phone;
            if (!customersMap.has(phone)) {
                customersMap.set(phone, {
                    name: order.customer.name,
                    phone: phone,
                    address: order.customer.address,
                    orderCount: 1,
                    totalSpend: order.total
                });
            } else {
                const existing = customersMap.get(phone);
                existing.orderCount += 1;
                existing.totalSpend += order.total;
            }
        });
        return Array.from(customersMap.values());
    };

    if (!isOpen) return null;

    if (!isAuthenticated) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="glass" style={{
                    padding: '2.5rem', borderRadius: '25px', width: '90%', maxWidth: '400px',
                    textAlign: 'center', position: 'relative', background: 'var(--bg)'
                }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>✕</button>
                    {!showForgot ? (
                        <>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{t.adminPassword}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>{t.enterPassword}</p>

                            <form onSubmit={handleLogin}>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="****"
                                    autoFocus
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '12px',
                                        border: '1px solid #ddd', marginBottom: '1rem', textAlign: 'center',
                                        fontSize: '1.2rem', letterSpacing: '5px'
                                    }}
                                />
                                {error && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
                                <button type="submit" className="primary-btn" style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                                    {t.login}
                                </button>
                            </form>
                            <button
                                onClick={() => setShowForgot(true)}
                                style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {t.forgotPassword}
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{t.forgotPassword}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                                {lang === 'ur' ? 'پاس ورڈ ری سیٹ کرنے کے لیے ریکوری کی درج کریں۔' : 'Enter recovery key to reset password.'}
                            </p>

                            <form onSubmit={handleRecovery}>
                                <input
                                    type="text"
                                    value={recoveryInput}
                                    onChange={(e) => setRecoveryInput(e.target.value)}
                                    placeholder={t.recoveryKey}
                                    autoFocus
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '12px',
                                        border: '1px solid #ddd', marginBottom: '1rem', textAlign: 'center'
                                    }}
                                />
                                {error && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
                                <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--accent)', color: 'var(--text)', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                                    {lang === 'ur' ? 'ری سیٹ کریں' : 'Reset'}
                                </button>
                            </form>
                            <button
                                onClick={() => { setShowForgot(false); setError(''); }}
                                style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                                ← {lang === 'ur' ? 'واپس لاگ ان' : 'Back to Login'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const customers = getCustomers();

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'
        }}>
            <div className="glass" style={{
                width: '100%', maxWidth: '1000px', maxHeight: '95vh', backgroundColor: 'var(--bg)',
                borderRadius: '25px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', overflowX: 'auto' }}>
                        <h3 style={{ margin: 0, whiteSpace: 'nowrap' }}>{t.adminTitle}</h3>
                        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '12px' }}>
                            {['orders', 'customers', 'settings'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '10px', border: 'none',
                                        backgroundColor: activeTab === tab ? 'var(--primary)' : 'transparent',
                                        color: activeTab === tab ? 'white' : 'var(--text)',
                                        fontWeight: 600, cursor: 'pointer', transition: '0.3s', whiteSpace: 'nowrap'
                                    }}
                                >
                                    {tab === 'orders' ? t.allOrders : tab === 'customers' ? t.customerList : t.settings}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {activeTab !== 'settings' && (
                            <button
                                onClick={exportToCSV}
                                style={{
                                    padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--primary)',
                                    backgroundColor: 'transparent', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                {t.exportCSV}
                            </button>
                        )}
                        <button onClick={onClose} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>✕</button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {activeTab === 'orders' ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ur' ? 'right' : 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '12px' }}>{t.table_name}</th>
                                        <th style={{ padding: '12px' }}>{t.table_phone}</th>
                                        <th style={{ padding: '12px' }}>{t.table_time}</th>
                                        <th style={{ padding: '12px' }}>{t.table_total}</th>
                                        <th style={{ padding: '12px' }}>{t.table_items}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px' }}>{order.customer.name}</td>
                                            <td style={{ padding: '12px' }}>{order.customer.phone}</td>
                                            <td style={{ padding: '12px' }}>{order.date}</td>
                                            <td style={{ padding: '12px' }}>{Math.round(order.total)} {t.rupees}</td>
                                            <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                                                {order.items.map(i => `${i.name[lang]} (${i.qty})`).join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {orders.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>{t.noOrders}</p>}
                        </div>
                    ) : activeTab === 'customers' ? (
                        <div style={{ overflowX: 'auto' }}>
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '12px', fontSize: '0.9rem', color: '#2e7d32' }}>
                                💡 {t.bulkMessageInfo}
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ur' ? 'right' : 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '12px' }}>{t.table_name}</th>
                                        <th style={{ padding: '12px' }}>{t.table_phone}</th>
                                        <th style={{ padding: '12px' }}>{t.address}</th>
                                        <th style={{ padding: '12px' }}>{t.totalSpend}</th>
                                        <th style={{ padding: '12px' }}>{t.whatsapp}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((cust, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px', fontWeight: 600 }}>{cust.name}</td>
                                            <td style={{ padding: '12px' }}>{cust.phone}</td>
                                            <td style={{ padding: '12px', maxWidth: '200px', fontSize: '0.85rem' }}>{cust.address || '-'}</td>
                                            <td style={{ padding: '12px' }}>{Math.round(cust.totalSpend)} {t.rupees} ({cust.orderCount})</td>
                                            <td style={{ padding: '12px' }}>
                                                <button onClick={() => sendWhatsApp(cust.phone)} style={{ backgroundColor: '#25D366', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                                    {t.sendMessage} 📱
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <h4 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t.changePassword}</h4>
                            <form onSubmit={handleUpdateSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{t.currentPassword}</label>
                                    <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} required style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{t.newPassword}</label>
                                    <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="****" style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{t.confirmPassword}</label>
                                    <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="****" style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
                                </div>
                                <hr style={{ margin: '1rem 0', opacity: 0.1 }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{t.recoveryKey} (Master Key)</label>
                                    <input type="text" value={newRecovery} onChange={e => setNewRecovery(e.target.value)} placeholder={savedRecoveryKey} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '5px' }}>{t.setupRecoveryKey}</p>
                                </div>
                                <button type="submit" style={{ marginTop: '1rem', backgroundColor: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                                    {t.saveSettings}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
