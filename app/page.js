import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { ArrowRight, PenTool, Palette, Compass } from 'lucide-react';
import { getFeaturedContent } from '@/lib/data';

export default async function Home() {
    const featuredItems = await getFeaturedContent();

    return (
        <div className={styles.container}>
            {/* Hero / About Section */}
            {/* Hero / About Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.handwrittenText}>
                        <p>I am an architecture student who thinks in <span className={styles.underline}>lines</span>,</p>
                        <p>shadows, and silence.</p>
                        <p>I draw faces, imagine spaces, write stories, and build</p>
                        <p>worlds—</p>
                        <p>sometimes with a pencil, sometimes with <span className={styles.underline}>words</span>.</p>
                    </div>

                    <div className={styles.heroFooter}>
                        <span>Architecture Student</span>
                        <span className={styles.separator}>|</span>
                        <span>Artist</span>
                        <span className={styles.separator}>|</span>
                        <span>Writer</span>
                    </div>
                </div>

                <div className={styles.heroImageWrapper}>
                    <div className={styles.photoCard}>
                        {/* Placeholder for Author Image - can be replaced with actual image */}
                        <div className={styles.photoPlaceholder}></div>
                    </div>
                </div>
            </section>

            {/* Featured Content Section */}
            {featuredItems.length > 0 && (
                <section className={styles.featuredSection}>
                    <h2 className={styles.sectionTitle}>Featured</h2>
                    <div className={styles.featuredGrid}>
                        {featuredItems.slice(0, 3).map((item) => (
                            <Link key={item.id} href={item.link} className={`glass-panel ${styles.featuredCard}`}>
                                {item.thumbnail && (
                                    <div className={styles.featuredImage}>
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                <div className={styles.featuredContent}>
                                    <span className={styles.contentBadge}>{item.type}</span>
                                    <h3 className={styles.featuredTitle}>{item.title}</h3>
                                    {item.description && (
                                        <p className={styles.featuredDesc}>
                                            {item.description.substring(0, 120)}...
                                        </p>
                                    )}
                                    {item.content && (
                                        <p className={styles.featuredDesc}>
                                            {item.content.substring(0, 120)}...
                                        </p>
                                    )}
                                    <span className={styles.readMore}>
                                        Read More <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Portfolio Section */}
            <section className={styles.portfolioSection}>
                <h2 className={styles.sectionTitle}>Portfolio</h2>

                <div className={styles.grid}>
                    <Link href="/writing" className={`glass-panel ${styles.card}`}>
                        <div className={styles.iconWrapper}>
                            <PenTool size={48} />
                        </div>
                        <h3 className={styles.cardTitle}>Writing</h3>
                        <p className={styles.cardDesc}>
                            Read my latest novels, short stories, and explore the drafts behind the finalized works.
                        </p>
                        <span className={styles.linkText}>Read Stories <ArrowRight size={16} /></span>
                    </Link>

                    <Link href="/architecture" className={`glass-panel ${styles.card}`}>
                        <div className={styles.iconWrapper}>
                            <Compass size={48} />
                        </div>
                        <h3 className={styles.cardTitle}>Architecture</h3>
                        <p className={styles.cardDesc}>
                            Explore my architectural projects, technical drawings, and design explorations from academic and studio work.
                        </p>
                        <span className={styles.linkText}>View Projects <ArrowRight size={16} /></span>
                    </Link>

                    <Link href="/artwork" className={`glass-panel ${styles.card}`}>
                        <div className={styles.iconWrapper}>
                            <Palette size={48} />
                        </div>
                        <h3 className={styles.cardTitle}>Artwork</h3>
                        <p className={styles.cardDesc}>
                            View my art gallery and witness the step-by-step progress of each piece.
                        </p>
                        <span className={styles.linkText}>View Gallery <ArrowRight size={16} /></span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
