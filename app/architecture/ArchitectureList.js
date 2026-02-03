'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './architecture.module.css';

export default function ArchitectureList({ projects }) {
    const [filter, setFilter] = useState('all'); // all, academic, studio, technical

    const filtered = projects.filter(p => {
        if (filter === 'all') return true;
        return p.category === filter;
    });

    return (
        <div>
            <div className={styles.filterBar}>
                <button
                    className={`${styles.filterBtn} ${filter === 'all' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Projects
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'academic' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('academic')}
                >
                    Academic
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'studio' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('studio')}
                >
                    Design Studio
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'technical' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('technical')}
                >
                    Technical Drawings
                </button>
            </div>

            <div className={styles.grid}>
                {filtered.map(project => {
                    const thumbnail = project.images && project.images.length > 0
                        ? project.images[0].path
                        : null;

                    return (
                        <Link key={project.id} href={`/architecture/${project.id}`} className={`glass-panel ${styles.card}`}>
                            {thumbnail && (
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={thumbnail}
                                        alt={project.title}
                                        fill
                                        className={styles.image}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>{project.title}</h2>
                                <div className={styles.cardMeta}>
                                    <span className={styles.category}>{project.category}</span>
                                    {project.year && <span> • {project.year}</span>}
                                </div>
                                {project.description && (
                                    <p className={styles.cardDesc}>
                                        {project.description.substring(0, 120)}...
                                    </p>
                                )}
                            </div>
                        </Link>
                    );
                })}
                {filtered.length === 0 && (
                    <p className={styles.subtitle}>No projects found in this category.</p>
                )}
            </div>
        </div>
    );
}
