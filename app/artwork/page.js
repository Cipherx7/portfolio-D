import { getArtwork } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import styles from './artwork.module.css';

export const metadata = {
    title: 'Artwork | My Portfolio',
};

export default async function ArtworkPage() {
    const artwork = await getArtwork({ status: 'final' });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Artistic Journey</h1>
                <p className={styles.subtitle}>From sketch to masterpiece. Witness the evolution.</p>
            </header>

            <div className={styles.grid}>
                {artwork.map(art => {
                    // Use the last step (latest version) as the thumbnail
                    const latest = art.steps[art.steps.length - 1];
                    return (
                        <Link key={art.id} href={`/artwork/${art.id}`} className={`glass-panel ${styles.card}`}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={latest.image}
                                    alt={art.title}
                                    fill
                                    className={styles.image}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>{art.title}</h2>
                                <span className={styles.cardStage}>{latest.stage}</span>
                            </div>
                        </Link>
                    );
                })}
                {artwork.length === 0 && (
                    <p className={styles.subtitle}>No artwork uploaded yet.</p>
                )}
            </div>
        </div>
    );
}
