import { getWritingBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import styles from './slug.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function WritingDetailPage({ params }) {
    const { slug } = await params;
    const writing = await getWritingBySlug(slug);

    if (!writing) {
        notFound();
    }

    return (
        <article className={styles.article}>
            <Link href="/writing" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to Writings
            </Link>

            <header className={styles.header}>
                <h1 className={styles.title}>{writing.title}</h1>
                <div className={styles.meta}>
                    <span className={styles.status}>{writing.status}</span>
                    <time>{new Date(writing.date).toLocaleDateString()}</time>
                </div>
            </header>

            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: writing.content }}
            />
        </article>
    );
}
