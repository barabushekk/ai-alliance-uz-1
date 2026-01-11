import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader, AlertCircle } from 'lucide-react';
import './Admin.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Clear error when user types
    useEffect(() => {
        if (error) setError(null);
    }, [email, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError('Неверный email или пароль. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            {/* Animated Background */}
            <div className="login-background"></div>

            {/* Glassmorphism Card */}
            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="login-header">
                    <motion.div
                        className="login-logo-box"
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <Lock size={28} strokeWidth={2.5} />
                    </motion.div>
                    <h1>Вход в систему</h1>
                    <p>Панель администратора AI Alliance</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Email адрес</label>
                        <div className="input-wrapper">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <div className="input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            className="error-message"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <>
                                <Loader className="spin" size={20} style={{ marginRight: '8px' }} />
                                Входим...
                            </>
                        ) : (
                            'Войти'
                        )}
                    </motion.button>

                    <p className="hint-text">
                        Забыли пароль? Обратитесь к системному администратору.
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
