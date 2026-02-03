import { getArchitectureById } from '@/lib/data';
import { notFound } from 'next/navigation';
import ProjectGallery from './ProjectGallery';
import styles from './detail.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ArchitectureDetailPage({ params }) {
    const { id } = await params;
    const project = await getArchitectureById(id);

    if (!project) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <Link href="/architecture" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to Portfolio
            </Link>

            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{project.title}</h1>
                    <div className={styles.meta}>
                        <span className={styles.category}>{project.category}</span>
                        {project.year && <span>{project.year}</span>}
                    </div>
                </header>

                {project.description && (
                    <div className={styles.description}>
                        <p>{project.description}</p>
                    </div>
                )}

                {project.software && project.software.length > 0 && (
                    <div className={styles.techSection}>
                        <h3 className={styles.sectionTitle}>Software & Tools</h3>
                        <div className={styles.tags}>
                            {project.software.map((tool, i) => (
                                <span key={i} className={styles.tag}>{tool}</span>
                            ))}
                        </div>
                    </div>
                )}

                {project.images && project.images.length > 0 && (
                    <ProjectGallery images={project.images} projectTitle={project.title} />
                )}
            </div>
        </div>
    );
}
