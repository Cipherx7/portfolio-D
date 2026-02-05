import './globals.css';
import { Inter, Playfair_Display, Caveat } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-handwriting' });

export const metadata = {
    title: 'My Portfolio',
    description: 'Personal writing and artwork portfolio',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} ${caveat.variable}`}>
                <main className="container" style={{ paddingBottom: '100px', paddingTop: '2rem' }}>
                    {children}
                </main>
                <Navbar />
            </body>
        </html>
    );
}
