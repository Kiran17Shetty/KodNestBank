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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
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
            style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
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

            <div style={{ width: '100%', maxWidth: 780, padding: '0 20px', position: 'relative', zIndex: 1 }}>
                {/* Main Card */}
                <div
                    className="glass-card fade-in"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '28% 44% 28%',
                        overflow: 'hidden',
                    }}
                >
                    {/* LEFT SECTION */}
                    <div
                        style={{
                            borderRight: '1px solid var(--border-subtle)',
                            padding: '36px 28px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 20 }}>
                                Welcome to KodBank
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                                Sign in to continue
                            </p>
                            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />
                        </div>

                        <div>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 18 }}>Kod</span>
                            <span style={{ color: 'var(--accent-green)', fontWeight: 800, fontSize: 18 }}>Bank</span>
                        </div>

                        <div
                            style={{
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: 'var(--text-secondary)',
                                fontSize: 12,
                            }}
                        >
                            🔒 Secure Banking
                        </div>
                    </div>

                    {/* MIDDLE SECTION */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            borderRight: '1px solid var(--border-subtle)',
                            padding: '36px 28px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 16,
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
                                        position: 'absolute',
                                        right: 14,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        fontSize: 16,
                                        transition: 'color 0.3s ease',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* RIGHT SECTION */}
                    <div
                        style={{
                            padding: '36px 20px',
                            background: 'rgba(18,14,8,0.4)',
                            borderRadius: '0 16px 16px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <button
                            onClick={handleSubmit as any}
                            disabled={loading}
                            style={{
                                height: 140,
                                width: '100%',
                                background: 'linear-gradient(180deg, #6AAF45 0%, #A0522D 100%)',
                                borderRadius: 12,
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(106,175,69,0.3)';
                                e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {loading ? (
                                <div className="spinner" />
                            ) : (
                                <>
                                    <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 15 }}>Sign In</span>
                                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>→</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Below card */}
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginTop: 20 }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--accent-green)', textDecoration: 'none', fontWeight: 500 }}>
                        Register Now
                    </Link>
                </p>
            </div>
        </div>
    );
}
