'use client';
import { useState } from 'react';
import { verifyUser } from './auth';
import styles from './login.module.css';

export default function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Updated to pass both username and password
            const result = await verifyUser(username, password);

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
                <p className={styles.subtitle}>Enter your credentials to continue</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            placeholder="Enter username"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Enter password"
                            disabled={loading}
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
                        disabled={loading || !username || !password}
                    >
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
