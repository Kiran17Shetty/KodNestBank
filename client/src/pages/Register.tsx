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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <ToastContainer toasts={toasts} />

            {/* LEFT PANEL */}
            <div
                style={{
                    width: '40%',
                    background: 'var(--bg-secondary)',
                    borderRight: '1px solid var(--border-subtle)',
                    padding: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Floating orbs */}
                <div className="floating-orb orb-1" />
                <div className="floating-orb orb-2" />
                <div className="floating-orb orb-3" />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Logo */}
                    <div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 22 }}>Kod</span>
                        <span style={{ color: 'var(--accent-green)', fontWeight: 800, fontSize: 22 }}>Bank</span>
                    </div>
                    <div style={{ width: 40, height: 3, background: 'var(--accent-green)', marginTop: 8 }} />

                    {/* Tagline */}
                    <h1 style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 40, marginTop: 40, lineHeight: 1.1 }}>
                        Bank Bold.
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 8 }}>
                        The new way to own your money.
                    </p>

                    {/* Features */}
                    <div style={{ marginTop: 32 }}>
                        {['256-bit encryption', 'JWT secured sessions', 'Real-time balance'].map(f => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{ width: 8, height: 8, background: 'var(--accent-green)', borderRadius: 2, flexShrink: 0 }} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>⚡ Powered by KodBank</span>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div
                style={{
                    width: '60%',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 48,
                }}
            >
                <div style={{ maxWidth: 480, width: '100%' }}>
                    <h2 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 24 }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Takes less than a minute</p>
                    <div style={{ height: 1, background: 'var(--border-subtle)', margin: '20px 0' }} />

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {/* Username */}
                            <div>
                                <label className="input-label">Username</label>
                                <input
                                    className="glass-input"
                                    placeholder="johndoe"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                />
                                {errors.username && <span style={{ color: 'var(--error)', fontSize: 13, marginTop: 4, display: 'block' }}>{errors.username}</span>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="input-label">Email</label>
                                <input
                                    className="glass-input"
                                    placeholder="john@email.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
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
                                {errors.password && <span style={{ color: 'var(--error)', fontSize: 13, marginTop: 4, display: 'block' }}>{errors.password}</span>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="input-label">Phone</label>
                                <input
                                    className="glass-input"
                                    placeholder="+91 9876543210"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Role Dropdown */}
                        <div style={{ marginTop: 16, position: 'relative' }}>
                            <label className="input-label">Role</label>
                            <div
                                className="glass-input"
                                onClick={() => setRoleOpen(!roleOpen)}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span>🏦 Customer</span>
                                <span
                                    style={{
                                        color: 'var(--accent-green)',
                                        transition: 'transform 0.3s ease',
                                        transform: roleOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        display: 'inline-block',
                                    }}
                                >
                                    ▼
                                </span>
                            </div>

                            {roleOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: 4,
                                        background: 'rgba(42,28,14,0.95)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 12,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                                        zIndex: 10,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '12px 16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            color: 'var(--text-primary)',
                                            fontSize: 15,
                                            cursor: 'default',
                                            background: 'rgba(106,175,69,0.1)',
                                        }}
                                        onClick={() => setRoleOpen(false)}
                                    >
                                        <span>🏦 Customer</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>🔒</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="pill-btn pill-btn-primary"
                            disabled={loading}
                            style={{ width: '100%', marginTop: 24, padding: '14px' }}
                        >
                            {loading ? <div className="spinner" /> : 'Create Account →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginTop: 20 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent-green)', textDecoration: 'none', fontWeight: 500 }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
