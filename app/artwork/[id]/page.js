import { getArtwork } from '@/lib/data';
import { notFound } from 'next/navigation';
import ArtProgress from './ArtProgress';
import styles from './detail.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ArtworkDetailPage({ params }) {
    const { id } = await params;
    const artworkList = await getArtwork();
    const artwork = artworkList.find(a => a.id === id);

    if (!artwork) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <Link href="/artwork" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to Gallery
            </Link>

            <div className={styles.content}>
                <div className={styles.info}>
                    <h1 className={styles.title}>{artwork.title}</h1>
                    <p className={styles.description}>{artwork.description}</p>
                </div>

                <ArtProgress artwork={artwork} />
            </div>
        </div>
    );
}
