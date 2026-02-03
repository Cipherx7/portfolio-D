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
            <section className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <h1 className={styles.title}>About the Author.</h1>
                    <p className={styles.bio}>
                        Welcome to my creative corner. I am an undergraduate architecture graduate and a passionate writer,
                        weaving stories with words while designing spaces with purpose.

                        <br /><br />
                        Here you will find my architectural projects, creative writings, and artistic explorations.
                        Building worlds—both physical and fictional—is my passion, and this portfolio is where they all come together.
                    </p>
                </div>
                {/* Placeholder for Author Image - using a div for now or could ask user for an image */}
                <div className={`${styles.imagePlaceholder} glass-panel`}>
                    <span style={{ opacity: 0.5 }}>Author Image</span>
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
