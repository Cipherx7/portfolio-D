import { getArchitecture } from '@/lib/data';
import ArchitectureList from './ArchitectureList';
import styles from './architecture.module.css';

export const metadata = {
    title: 'Architecture | My Portfolio',
};

export default async function ArchitecturePage() {
    const projects = await getArchitecture({ status: 'final' });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Architecture Portfolio</h1>
                <p className={styles.subtitle}>Design projects, technical drawings, and creative explorations.</p>
            </header>

            <ArchitectureList projects={projects} />
        </div>
    );
}
