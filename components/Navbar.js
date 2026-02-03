'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenTool, Palette, Upload, Home, Compass } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/', icon: <Home size={18} /> },
        { name: 'Writing', href: '/writing', icon: <PenTool size={18} /> },
        { name: 'Architecture', href: '/architecture', icon: <Compass size={18} /> },
        { name: 'Artwork', href: '/artwork', icon: <Palette size={18} /> },
        // { name: 'Upload', href: '/admin', icon: <Upload size={18} /> }, // Hidden
    ];

    return (
        <nav className={styles.navContainer}>
            <div className={styles.navGlass}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                        >
                            {item.icon}
                            <span className={styles.navText}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
