import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, useToast } from '../components/Toast';

export default function Login() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const { toasts, addToast } = useToast();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e?: FormEvent) => {
        e?.preventDefault();
        if (!username.trim() || !password.trim()) {
            addToast('Please fill in all fields', 'error');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/api/login', { username, password });
            setAuth({ username: res.data.username, role: 'Customer', uid: '' });
            navigate('/dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed';
            addToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="page-bg"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <ToastContainer toasts={toasts} />

            {/* Floating orbs */}
            <div className="floating-orb orb-1" />
            <div className="floating-orb orb-2" />
            <div className="floating-orb orb-3" />
            <div className="floating-orb orb-4" />

            <div style={{ width: '100%', maxWidth: 820, padding: '0 20px', position: 'relative', zIndex: 1 }}>
                {/* Main Card */}
                <div className="glass-card fade-in" style={{ display: 'grid', gridTemplateColumns: '30% 42% 28%', overflow: 'hidden' }}>

                    {/* LEFT SECTION — Branding */}
                    <div
                        style={{
                            borderRight: '1px solid var(--border-subtle)',
                            padding: '36px 26px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            background: 'linear-gradient(180deg, rgba(59,130,246,0.04) 0%, transparent 60%)',
                        }}
                    >
                        <div>
                            <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 20, lineHeight: 1.3 }}>
                                Welcome to<br />
                                <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    KodBank
                                </span>
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
                                Sign in to your account
                            </p>
                            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '18px 0' }} />
                        </div>

                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 8,
                                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 13,
                                    fontWeight: 900,
                                    color: '#fff',
                                }}
                            >
                                K
                            </div>
                            <span style={{ fontWeight: 800, fontSize: 16 }}>
                                <span style={{ color: 'var(--text-primary)' }}>Kod</span>
                                <span style={{ color: 'var(--accent-blue-light)' }}>Bank</span>
                            </span>
                        </div>

                        {/* Badge */}
                        <div
                            style={{
                                background: 'rgba(16, 185, 129, 0.08)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: 10,
                                padding: '10px 14px',
                                color: 'var(--accent-emerald-light)',
                                fontSize: 12,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <div className="status-dot" />
                            Secure Banking
                        </div>
                    </div>

                    {/* MIDDLE SECTION — Form */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            borderRight: '1px solid var(--border-subtle)',
                            padding: '36px 28px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 18,
                        }}
                    >
                        <div>
                            <label className="input-label" style={{ fontSize: 11 }}>Username</label>
                            <input
                                className="glass-input"
                                placeholder="Enter username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="input-label" style={{ fontSize: 11 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="glass-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ paddingRight: 44 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'var(--text-muted)', fontSize: 16, transition: 'color 0.3s ease',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* RIGHT SECTION — Sign In Button */}
                    <div
                        style={{
                            padding: '36px 20px',
                            background: 'linear-gradient(180deg, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.04) 100%)',
                            borderRadius: '0 20px 20px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <button
                            onClick={() => handleSubmit()}
                            disabled={loading}
                            style={{
                                height: 150,
                                width: '100%',
                                background: 'linear-gradient(180deg, #3B82F6 0%, #8B5CF6 50%, #6D28D9 100%)',
                                borderRadius: 16,
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.45)';
                                e.currentTarget.style.transform = 'scale(1.03)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.3)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {/* Shine overlay */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
                                pointerEvents: 'none',
                            }} />
                            {loading ? (
                                <div className="spinner" />
                            ) : (
                                <>
                                    <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16, position: 'relative' }}>Sign In</span>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, position: 'relative' }}>→</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Below card */}
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginTop: 24 }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--accent-blue-light)', textDecoration: 'none', fontWeight: 600 }}>
                        Register Now
                    </Link>
                </p>
            </div>
        </div>
    );
}
