'use client';
import { useState } from 'react';
import { verifyPassword } from './auth';
import styles from './login.module.css';

export default function LoginForm({ onLoginSuccess }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await verifyPassword(password);

            if (result.success) {
                // Store authentication in session storage
                sessionStorage.setItem('admin_authenticated', 'true');
                onLoginSuccess();
            } else {
                setError(result.error || 'Authentication failed');
                setPassword('');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={`glass-panel ${styles.loginBox}`}>
                <h1 className={styles.title}>Admin Access</h1>
                <p className={styles.subtitle}>Enter your password to continue</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Enter admin password"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading || !password}
                    >
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                </form>

                <p className={styles.hint}>
                    Default password: <code>drushti2024</code> (change in .env.local)
                </p>
            </div>
        </div>
    );
}
