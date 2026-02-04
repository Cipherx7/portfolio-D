'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './writing.module.css';

export default function WritingList({ writings }) {
    // Helper to strip HTML tags for excerpt
    const getExcerpt = (html) => {
        if (!html) return '';
        const tmp = html.replace(/<[^>]+>/g, '');
        return tmp.substring(0, 150) + '...';
    };

    return (
        <div>
            <div className={styles.grid}>
                {writings.map(w => (
                    <Link key={w.id} href={`/writing/${w.slug}`} className={`glass-panel ${styles.card}`}>
                        <h2 className={styles.cardTitle}>{w.title}</h2>
                        <div className={styles.cardMeta}>
                            <span>{new Date(w.date).toLocaleDateString()}</span>
                        </div>
                        <p className={styles.cardExcerpt}>
                            {getExcerpt(w.content)}
                        </p>
                    </Link>
                ))}
                {writings.length === 0 && (
                    <p className={styles.subtitle}>No writings found.</p>
                )}
            </div>
        </div>
    );
}
