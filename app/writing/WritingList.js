'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './writing.module.css';

export default function WritingList({ writings }) {
    const [filter, setFilter] = useState('all'); // all, final, draft

    const filtered = writings.filter(w => {
        if (filter === 'all') return true;
        return w.status === filter;
    });

    return (
        <div>
            <div className={styles.filterBar}>
                <button
                    className={`${styles.filterBtn} ${filter === 'all' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'final' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('final')}
                >
                    Finalized
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'draft' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('draft')}
                >
                    Drafts
                </button>
            </div>

            <div className={styles.grid}>
                {filtered.map(w => (
                    <Link key={w.id} href={`/writing/${w.slug}`} className={`glass-panel ${styles.card}`}>
                        <h2 className={styles.cardTitle}>{w.title}</h2>
                        <div className={styles.cardMeta}>
                            <span>{new Date(w.date).toLocaleDateString()}</span>
                            {' • '}
                            <span style={{ textTransform: 'capitalize' }}>{w.status}</span>
                        </div>
                        <p className={styles.cardExcerpt}>
                            {w.content.substring(0, 150)}...
                        </p>
                    </Link>
                ))}
                {filtered.length === 0 && (
                    <p className={styles.subtitle}>No writings found in this category.</p>
                )}
            </div>
        </div>
    );
}
