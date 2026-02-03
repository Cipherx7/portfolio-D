import { getWritings } from '@/lib/data';
import WritingList from './WritingList';
import styles from './writing.module.css';

export const metadata = {
    title: 'Writing | My Portfolio',
};

export default async function WritingPage() {
    const writings = await getWritings();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>My Writings</h1>
                <p className={styles.subtitle}>Drafts, ideas, and finished tales.</p>
            </header>

            <WritingList writings={writings} />
        </div>
    );
}
