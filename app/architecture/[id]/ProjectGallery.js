'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './ProjectGallery.module.css';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectGallery({ images, projectTitle }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const openLightbox = (index) => {
        setSelectedIndex(index);
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
    };

    const goToPrevious = () => {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const goToNext = () => {
        setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    return (
        <>
            <div className={styles.gallery}>
                <h3 className={styles.sectionTitle}>Project Gallery</h3>
                <div className={styles.grid}>
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`glass-panel ${styles.imageCard}`}
                            onClick={() => openLightbox(index)}
                        >
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={img.path}
                                    alt={img.caption || `${projectTitle} - Image ${index + 1}`}
                                    fill
                                    className={styles.image}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            {img.caption && (
                                <p className={styles.caption}>{img.caption}</p>
                            )}
                            {img.type && (
                                <span className={styles.imageType}>{img.type}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedIndex !== null && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.closeBtn} onClick={closeLightbox}>
                        <X size={24} />
                    </button>

                    <button
                        className={`${styles.navBtn} ${styles.prevBtn}`}
                        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.lightboxImage}>
                            <Image
                                src={images[selectedIndex].path}
                                alt={images[selectedIndex].caption || projectTitle}
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        {images[selectedIndex].caption && (
                            <p className={styles.lightboxCaption}>{images[selectedIndex].caption}</p>
                        )}
                    </div>

                    <button
                        className={`${styles.navBtn} ${styles.nextBtn}`}
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            )}
        </>
    );
}
