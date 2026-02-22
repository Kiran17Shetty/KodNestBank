import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ToastContainer, useToast } from '../components/Toast';

export default function Register() {
    const navigate = useNavigate();
    const { toasts, addToast } = useToast();

    const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [roleOpen, setRoleOpen] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.username.trim()) errs.username = 'Username is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await api.post('/api/register', {
                username: form.username,
                email: form.email,
                password: form.password,
                phone: form.phone || undefined,
            });
            addToast('Account created successfully ✅', 'success');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Registration failed';
            addToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-bg" style={{ display: 'flex', minHeight: '100vh' }}>
            <ToastContainer toasts={toasts} />

            {/* LEFT PANEL — Branding */}
            <div
                className="slide-in-left"
                style={{
                    width: '42%',
                    background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.95) 0%, rgba(6, 13, 24, 0.98) 100%)',
                    borderRight: '1px solid var(--border-subtle)',
                    padding: '48px 44px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 1,
                }}
            >
                {/* Decorative gradient blob */}
                <div
                    style={{
                        position: 'absolute',
                        top: -80,
                        left: -80,
                        width: 350,
                        height: 350,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -60,
                        right: -60,
                        width: 280,
                        height: 280,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                                fontWeight: 900,
                                color: '#fff',
                                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                            }}
                        >
                            K
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 22 }}>
                            <span style={{ color: 'var(--text-primary)' }}>Kod</span>
                            <span style={{ color: 'var(--accent-blue-light)' }}>Bank</span>
                        </span>
                    </div>
                    <div
                        style={{
                            width: 44,
                            height: 3,
                            background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
                            borderRadius: 2,
                            marginTop: 12,
                        }}
                    />

                    {/* Tagline */}
                    <h1
                        style={{
                            fontWeight: 900,
                            fontSize: 42,
                            marginTop: 44,
                            lineHeight: 1.1,
                            background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Bank Bold.
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginTop: 10, lineHeight: 1.6 }}>
                        The new way to own your money.<br />
                        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Secure. Fast. Modern.</span>
                    </p>

                    {/* Feature list */}
                    <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { icon: '🔐', text: '256-bit AES encryption', color: '#3B82F6' },
                            { icon: '🛡️', text: 'JWT secured sessions', color: '#8B5CF6' },
                            { icon: '⚡', text: 'Real-time balance tracking', color: '#10B981' },
                        ].map((f) => (
                            <div
                                key={f.text}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 14,
                                    padding: '10px 14px',
                                    background: 'rgba(15, 25, 50, 0.5)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 12,
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: `${f.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 14,
                                    }}
                                >
                                    {f.icon}
                                </div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="status-dot" />
                    <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>Powered by KodBank</span>
                </div>
            </div>

            {/* RIGHT PANEL — Form */}
            <div
                className="slide-in-right"
                style={{
                    width: '58%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 48,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div style={{ maxWidth: 500, width: '100%' }}>
                    <div style={{ marginBottom: 28 }}>
                        <h2
                            style={{
                                fontWeight: 700,
                                fontSize: 26,
                                background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Create Account
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6 }}>
                            Join KodBank — takes less than a minute
                        </p>
                    </div>
                    <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 24 }} />

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                            {/* Username */}
                            <div>
                                <label className="input-label">Username</label>
                                <input className="glass-input" placeholder="johndoe" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                                {errors.username && <span style={{ color: 'var(--error)', fontSize: 13, marginTop: 4, display: 'block' }}>{errors.username}</span>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="input-label">Email</label>
                                <input className="glass-input" placeholder="john@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                {errors.email && <span style={{ color: 'var(--error)', fontSize: 13, marginTop: 4, display: 'block' }}>{errors.email}</span>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="input-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="glass-input"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
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
                                {errors.password && <span style={{ color: 'var(--error)', fontSize: 13, marginTop: 4, display: 'block' }}>{errors.password}</span>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="input-label">Phone</label>
                                <input className="glass-input" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                        </div>

                        {/* Role Dropdown */}
                        <div style={{ marginTop: 18, position: 'relative' }}>
                            <label className="input-label">Role</label>
                            <div
                                className="glass-input"
                                onClick={() => setRoleOpen(!roleOpen)}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 16 }}>🏦</span> Customer
                                </span>
                                <span
                                    style={{
                                        color: 'var(--accent-blue)',
                                        transition: 'transform 0.3s ease',
                                        transform: roleOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        display: 'inline-block',
                                        fontSize: 12,
                                    }}
                                >
                                    ▼
                                </span>
                            </div>
                            {roleOpen && (
                                <div
                                    style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                                        background: 'rgba(15, 25, 50, 0.95)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 14, boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                                        zIndex: 10, overflow: 'hidden',
                                        backdropFilter: 'blur(20px)',
                                    }}
                                >
                                    <div
                                        onClick={() => setRoleOpen(false)}
                                        style={{
                                            padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            color: 'var(--text-primary)', fontSize: 15, cursor: 'default',
                                            background: 'rgba(59, 130, 246, 0.08)',
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 16 }}>🏦</span> Customer
                                        </span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>🔒</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button type="submit" className="pill-btn pill-btn-primary" disabled={loading} style={{ width: '100%', marginTop: 28, padding: '16px' }}>
                            {loading ? <div className="spinner" /> : 'Create Account →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginTop: 24 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent-blue-light)', textDecoration: 'none', fontWeight: 600 }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
