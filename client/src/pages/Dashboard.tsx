import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, useToast } from '../components/Toast';

export default function Dashboard() {
    const navigate = useNavigate();
    const { username, setAuth } = useAuth();
    const { toasts, addToast } = useToast();

    const [_balance, setBalance] = useState<number | null>(null);
    const [displayBalance, setDisplayBalance] = useState(0);
    const [balanceRevealed, setBalanceRevealed] = useState(false);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const animRef = useRef<number | null>(null);

    // Auth guard
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/api/me');
                setAuth({ username: res.data.username, role: res.data.role, uid: res.data.uid });
            } catch {
                navigate('/login');
            }
        };
        if (!username) checkAuth();
    }, [username, navigate, setAuth]);

    const handleLogout = async () => {
        try {
            await api.post('/api/logout');
        } catch { /* ignore */ }
        setAuth(null);
        navigate('/login');
    };

    const animateCountUp = useCallback((target: number) => {
        const duration = 1500;
        const start = performance.now();
        const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayBalance(Math.floor(target * eased));
            if (progress < 1) {
                animRef.current = requestAnimationFrame(step);
            } else {
                setDisplayBalance(target);
            }
        };
        animRef.current = requestAnimationFrame(step);
    }, []);

    const handleRevealBalance = async () => {
        setLoadingBalance(true);
        try {
            const res = await api.get('/api/getBalance');
            const bal = res.data.balance;
            setBalance(bal);
            setBalanceRevealed(true);
            setLoadingBalance(false);

            animateCountUp(bal);

            // Fire confetti
            setTimeout(() => {
                const colors = ['#6AAF45', '#A0522D', '#F5ECD7', '#C8762A', '#86BC64'];
                confetti({ particleCount: 120, spread: 80, origin: { x: 0.2, y: 0.6 }, colors });
                confetti({ particleCount: 120, spread: 80, origin: { x: 0.8, y: 0.6 }, colors });
                confetti({ particleCount: 80, spread: 120, origin: { x: 0.5, y: 0.5 }, colors: ['#6AAF45', '#A0522D', '#F5ECD7'] });
                confetti({ particleCount: 40, spread: 60, shapes: ['star'], origin: { x: 0.5, y: 0.4 }, colors: ['#6AAF45', '#A0522D', '#F5ECD7'] });
                setShowCelebration(true);
            }, 200);
        } catch (err: any) {
            setLoadingBalance(false);
            if (err.response?.status === 401) {
                addToast('Session expired. Please login again.', 'error');
                setTimeout(() => {
                    setAuth(null);
                    navigate('/login');
                }, 1500);
            } else {
                addToast('Failed to fetch balance', 'error');
            }
        }
    };

    useEffect(() => {
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, []);

    const formatBalance = (val: number) => {
        return val.toLocaleString('en-IN');
    };

    const currentDate = new Date();
    const memberSince = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (!username) return null;

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <ToastContainer toasts={toasts} />

            {/* NAVBAR */}
            <nav
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: 'rgba(10,7,5,0.9)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border-subtle)',
                    height: 64,
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 22 }}>Kod</span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 800, fontSize: 22 }}>Bank</span>
                </div>

                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Dashboard Overview</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                        Hey, {username}! 👋
                    </span>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            border: '2px solid var(--accent-green)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-green)',
                            fontWeight: 600,
                            fontSize: 16,
                        }}
                    >
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="glass-card"
                        style={{
                            borderRadius: 50,
                            padding: '6px 16px',
                            color: 'var(--text-secondary)',
                            fontSize: 13,
                            cursor: 'pointer',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--error)';
                            e.currentTarget.style.color = 'var(--error)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

                {/* HERO BANNER */}
                <div className="glass-card" style={{ padding: 40, marginTop: 32 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 24, alignItems: 'center' }}>
                        {/* LEFT */}
                        <div>
                            <span
                                style={{
                                    color: 'var(--accent-green)',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                }}
                            >
                                YOUR ACCOUNT OVERVIEW
                            </span>
                            <h1 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 28, marginTop: 8 }}>
                                Welcome back, {username}!
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
                                Your finances are secure and up to date.
                            </p>

                            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                                {['🔐 Secure', '🚀 Active', '🎯 JWT Protected'].map(tag => (
                                    <span
                                        key={tag}
                                        style={{
                                            background: 'var(--glass-bg)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 50,
                                            padding: '6px 14px',
                                            color: 'var(--text-secondary)',
                                            fontSize: 12,
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <button
                                className="pill-btn pill-btn-primary"
                                style={{ marginTop: 24 }}
                                onClick={handleRevealBalance}
                            >
                                Reveal My Balance →
                            </button>
                        </div>

                        {/* RIGHT — Balance Card */}
                        <div
                            style={{
                                background: 'rgba(106,175,69,0.08)',
                                border: '1px solid rgba(134,188,100,0.3)',
                                borderRadius: 12,
                                padding: 28,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: 'rgba(134,188,100,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 20,
                                    }}
                                >
                                    💰
                                </div>
                                <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: 18 }}>
                                    Your Balance
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                                {balanceRevealed ? 'Current balance' : 'Tap reveal to see your balance'}
                            </p>

                            <div style={{ marginTop: 20 }}>
                                {!balanceRevealed ? (
                                    <span
                                        style={{
                                            color: 'var(--text-primary)',
                                            fontWeight: 700,
                                            fontSize: 36,
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        ₹ • • • • • •
                                    </span>
                                ) : (
                                    <span
                                        className="fade-in-up"
                                        style={{
                                            color: 'var(--text-primary)',
                                            fontWeight: 700,
                                            fontSize: 36,
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        ₹ {formatBalance(displayBalance)}
                                    </span>
                                )}
                            </div>

                            {showCelebration && (
                                <p className="fade-in-up" style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: 16, marginTop: 12 }}>
                                    🎉 Looking good, {username}!
                                </p>
                            )}

                            <button
                                className="pill-btn pill-btn-brown"
                                style={{ marginTop: 20 }}
                                onClick={handleRevealBalance}
                                disabled={loadingBalance}
                            >
                                {loadingBalance ? <div className="spinner" /> : 'Reveal Balance →'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ACCOUNT INFO CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 32 }}>
                    {[
                        {
                            icon: '🏦',
                            label: 'ACCOUNT TYPE',
                            value: 'Customer',
                            sub: 'Personal account',
                            topColor: '#A0522D',
                        },
                        {
                            icon: '✅',
                            label: 'STATUS',
                            value: 'Active',
                            sub: 'All systems normal',
                            topColor: '#6AAF45',
                            valueColor: '#6AAF45',
                        },
                        {
                            icon: '🔒',
                            label: 'SECURITY',
                            value: 'JWT Auth',
                            sub: 'Token based',
                            topColor: '#8B6914',
                        },
                        {
                            icon: '📅',
                            label: 'MEMBER SINCE',
                            value: memberSince,
                            sub: 'Account age',
                            topColor: '#86BC64',
                        },
                    ].map((card) => (
                        <div
                            key={card.label}
                            className="glass-card glass-card-interactive"
                            style={{
                                padding: 24,
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'default',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 4,
                                    background: card.topColor,
                                }}
                            />
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: 'rgba(134,188,100,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                    marginBottom: 12,
                                }}
                            >
                                {card.icon}
                            </div>
                            <span
                                style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: 11,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    fontWeight: 500,
                                }}
                            >
                                {card.label}
                            </span>
                            <p
                                style={{
                                    color: card.valueColor || 'var(--text-primary)',
                                    fontWeight: 600,
                                    fontSize: 16,
                                    marginTop: 4,
                                }}
                            >
                                {card.value}
                            </p>
                            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{card.sub}</span>
                        </div>
                    ))}
                </div>

                {/* FEATURES SECTION */}
                <div style={{ marginTop: 24, marginBottom: 48 }}>
                    <h2 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
                        Why KodBank?
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                            {
                                icon: '🔐',
                                title: 'Bank-grade Security',
                                desc: 'Your data is always encrypted',
                                iconColor: '#6AAF45',
                            },
                            {
                                icon: '⚡',
                                title: 'Instant Updates',
                                desc: 'Real-time balance and activity',
                                iconColor: '#A0522D',
                            },
                            {
                                icon: '📊',
                                title: 'Smart Dashboard',
                                desc: 'Everything in one place',
                                iconColor: '#6AAF45',
                            },
                        ].map(f => (
                            <div
                                key={f.title}
                                className="glass-card glass-card-interactive"
                                style={{ padding: 28, textAlign: 'center', cursor: 'default' }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        background: 'rgba(134,188,100,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 22,
                                        margin: '0 auto',
                                        color: f.iconColor,
                                    }}
                                >
                                    {f.icon}
                                </div>
                                <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15, marginTop: 16 }}>
                                    {f.title}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
