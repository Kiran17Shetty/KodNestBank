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
        localStorage.removeItem('kodbank_token');
        setAuth(null);
        navigate('/login');
    };

    const animateCountUp = useCallback((target: number) => {
        const duration = 1500;
        const start = performance.now();
        const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
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

            setTimeout(() => {
                const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#22D3EE', '#F1F5F9'];
                confetti({ particleCount: 120, spread: 80, origin: { x: 0.2, y: 0.6 }, colors });
                confetti({ particleCount: 120, spread: 80, origin: { x: 0.8, y: 0.6 }, colors });
                confetti({ particleCount: 80, spread: 120, origin: { x: 0.5, y: 0.5 }, colors: ['#3B82F6', '#8B5CF6', '#10B981'] });
                confetti({ particleCount: 40, spread: 60, shapes: ['star'], origin: { x: 0.5, y: 0.4 }, colors: ['#3B82F6', '#F59E0B', '#10B981'] });
                setShowCelebration(true);
            }, 200);
        } catch (err: any) {
            setLoadingBalance(false);
            if (err.response?.status === 401) {
                addToast('Session expired. Please login again.', 'error');
                setTimeout(() => { setAuth(null); navigate('/login'); }, 1500);
            } else {
                addToast('Failed to fetch balance', 'error');
            }
        }
    };

    useEffect(() => {
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, []);

    const formatBalance = (val: number) => val.toLocaleString('en-IN');
    const currentDate = new Date();
    const memberSince = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (!username) return null;

    return (
        <div className="page-bg">
            <ToastContainer toasts={toasts} />

            {/* NAVBAR */}
            <nav
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: 'rgba(6, 13, 24, 0.85)',
                    backdropFilter: 'blur(24px) saturate(1.5)',
                    WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
                    borderBottom: '1px solid var(--border-subtle)',
                    height: 68,
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            fontWeight: 900,
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                        }}
                    >
                        K
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 20 }}>
                        <span style={{ color: 'var(--text-primary)' }}>Kod</span>
                        <span style={{ color: 'var(--accent-blue-light)' }}>Bank</span>
                    </span>
                </div>

                {/* Center */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="status-dot" />
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Dashboard Overview</span>
                </div>

                {/* Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                        Hey, <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{username}</span>! 👋
                    </span>
                    <div
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 15,
                            boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                        }}
                    >
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            borderRadius: 50,
                            padding: '8px 18px',
                            color: 'var(--text-secondary)',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            background: 'rgba(15, 25, 50, 0.5)',
                            border: '1px solid var(--glass-border)',
                            backdropFilter: 'blur(8px)',
                            transition: 'all 0.3s ease',
                            fontFamily: 'Inter, sans-serif',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
                            e.currentTarget.style.color = '#EF4444';
                            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.background = 'rgba(15, 25, 50, 0.5)';
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 24px 48px', position: 'relative', zIndex: 1 }}>

                {/* HERO BANNER */}
                <div
                    className="glass-card fade-in"
                    style={{
                        padding: 0,
                        marginTop: 28,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {/* Top gradient accent */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                        background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #10B981)',
                    }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '58% 42%', minHeight: 340 }}>
                        {/* LEFT */}
                        <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span
                                style={{
                                    color: 'var(--accent-blue)',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                }}
                            >
                                <div className="status-dot" />
                                YOUR ACCOUNT OVERVIEW
                            </span>
                            <h1
                                style={{
                                    fontWeight: 800,
                                    fontSize: 30,
                                    marginTop: 12,
                                    lineHeight: 1.2,
                                    background: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Welcome back, {username}!
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
                                Your finances are secure and up to date.
                            </p>

                            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
                                {[
                                    { text: '🔐 Secure', color: '#3B82F6' },
                                    { text: '🚀 Active', color: '#10B981' },
                                    { text: '🎯 JWT Protected', color: '#8B5CF6' },
                                ].map(tag => (
                                    <span
                                        key={tag.text}
                                        style={{
                                            background: `${tag.color}10`,
                                            border: `1px solid ${tag.color}25`,
                                            borderRadius: 50,
                                            padding: '6px 16px',
                                            color: tag.color,
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {tag.text}
                                    </span>
                                ))}
                            </div>

                            <button
                                className="pill-btn pill-btn-primary"
                                style={{ marginTop: 28, width: 'fit-content' }}
                                onClick={handleRevealBalance}
                            >
                                ✨ Reveal My Balance →
                            </button>
                        </div>

                        {/* RIGHT — Balance Card */}
                        <div
                            style={{
                                borderLeft: '1px solid var(--border-subtle)',
                                background: 'linear-gradient(180deg, rgba(59,130,246,0.05) 0%, rgba(16,185,129,0.03) 100%)',
                                padding: '36px 32px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(34,211,238,0.1))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 22,
                                    }}
                                >
                                    💰
                                </div>
                                <div>
                                    <span style={{ color: 'var(--accent-emerald-light)', fontWeight: 700, fontSize: 17 }}>
                                        Your Balance
                                    </span>
                                    <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
                                        {balanceRevealed ? 'Current balance' : 'Tap reveal to see'}
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginTop: 28 }}>
                                {!balanceRevealed ? (
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: 38, fontFamily: 'monospace', letterSpacing: 4 }}>
                                        ₹ • • • • • •
                                    </span>
                                ) : (
                                    <span
                                        className="fade-in-up"
                                        style={{
                                            fontWeight: 800,
                                            fontSize: 38,
                                            fontFamily: 'monospace',
                                            background: 'linear-gradient(135deg, #10B981, #22D3EE)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        ₹ {formatBalance(displayBalance)}
                                    </span>
                                )}
                            </div>

                            {showCelebration && (
                                <p className="fade-in-up" style={{ color: 'var(--accent-emerald-light)', fontWeight: 600, fontSize: 15, marginTop: 14 }}>
                                    🎉 Looking good, {username}!
                                </p>
                            )}

                            <button
                                className="pill-btn pill-btn-secondary"
                                style={{ marginTop: 24, width: 'fit-content' }}
                                onClick={handleRevealBalance}
                                disabled={loadingBalance}
                            >
                                {loadingBalance ? <div className="spinner" /> : '💎 Reveal Balance →'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ACCOUNT INFO CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 28 }}>
                    {[
                        { icon: '🏦', label: 'ACCOUNT TYPE', value: 'Customer', sub: 'Personal account', gradient: 'linear-gradient(135deg, #3B82F6, #6366F1)', shadowColor: 'rgba(59,130,246,0.15)' },
                        { icon: '✅', label: 'STATUS', value: 'Active', sub: 'All systems normal', gradient: 'linear-gradient(135deg, #10B981, #22D3EE)', shadowColor: 'rgba(16,185,129,0.15)', valueColor: '#10B981' },
                        { icon: '🔒', label: 'SECURITY', value: 'JWT Auth', sub: 'Token based', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)', shadowColor: 'rgba(245,158,11,0.15)' },
                        { icon: '📅', label: 'MEMBER SINCE', value: memberSince, sub: 'Account age', gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)', shadowColor: 'rgba(139,92,246,0.15)' },
                    ].map((card) => (
                        <div
                            key={card.label}
                            className="glass-card glass-card-interactive fade-in-up"
                            style={{ padding: 24, position: 'relative', overflow: 'hidden' }}
                        >
                            {/* Top gradient bar */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: card.gradient }} />

                            <div
                                style={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 12,
                                    background: card.gradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                    marginBottom: 14,
                                    boxShadow: `0 4px 12px ${card.shadowColor}`,
                                }}
                            >
                                {card.icon}
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                                {card.label}
                            </span>
                            <p style={{ color: card.valueColor || 'var(--text-primary)', fontWeight: 700, fontSize: 17, marginTop: 4 }}>
                                {card.value}
                            </p>
                            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{card.sub}</span>
                        </div>
                    ))}
                </div>

                {/* FEATURES SECTION */}
                <div style={{ marginTop: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 20 }}>Why KodBank?</h2>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                            { icon: '🔐', title: 'Bank-grade Security', desc: 'Your data is always encrypted with AES-256 standard', gradient: 'linear-gradient(135deg, #3B82F6, #6366F1)', shadowColor: 'rgba(59,130,246,0.2)' },
                            { icon: '⚡', title: 'Instant Updates', desc: 'Real-time balance tracking and activity monitoring', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)', shadowColor: 'rgba(245,158,11,0.2)' },
                            { icon: '📊', title: 'Smart Dashboard', desc: 'Everything you need in one powerful interface', gradient: 'linear-gradient(135deg, #10B981, #22D3EE)', shadowColor: 'rgba(16,185,129,0.2)' },
                        ].map(f => (
                            <div
                                key={f.title}
                                className="glass-card glass-card-interactive fade-in-up"
                                style={{ padding: 32, textAlign: 'center' }}
                            >
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 16,
                                        background: f.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 24,
                                        margin: '0 auto',
                                        boxShadow: `0 6px 16px ${f.shadowColor}`,
                                    }}
                                >
                                    {f.icon}
                                </div>
                                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 16, marginTop: 18 }}>
                                    {f.title}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
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
