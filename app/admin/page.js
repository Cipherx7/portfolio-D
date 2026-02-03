'use client';
import { useState, useEffect } from 'react';
import { createWriting, createArtwork, createArchitecture } from './actions';
import LoginForm from './LoginForm';
import styles from './admin.module.css';
import { LogOut } from 'lucide-react';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('writing');
    const [imageCount, setImageCount] = useState(1);

    useEffect(() => {
        // Check authentication on mount
        const authStatus = sessionStorage.getItem('admin_authenticated');
        setIsAuthenticated(authStatus === 'true');
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_authenticated');
        setIsAuthenticated(false);
    };

    const addImageField = () => {
        setImageCount(prev => prev + 1);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Upload Content</h1>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'writing' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('writing')}
                >
                    New Writing
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'architecture' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('architecture'); setImageCount(1); }}
                >
                    New Architecture Project
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'artwork' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('artwork')}
                >
                    New Artwork
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                {activeTab === 'writing' ? (
                    <form action={createWriting} className={styles.form}>
                        <div className={styles.group}>
                            <label>Title</label>
                            <input type="text" name="title" required className={styles.input} />
                        </div>

                        <div className={styles.group}>
                            <label>Status</label>
                            <select name="status" className={styles.input}>
                                <option value="draft">Draft</option>
                                <option value="final">Finalized</option>
                            </select>
                        </div>

                        <div className={styles.group}>
                            <label>Content</label>
                            <textarea name="content" required className={styles.textarea} rows={10} />
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label>
                                <input type="checkbox" name="featured" />
                                <span>Mark as Featured (display on home page)</span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary">Publish Writing</button>
                    </form>
                ) : activeTab === 'architecture' ? (
                    <form action={createArchitecture} className={styles.form}>
                        <div className={styles.group}>
                            <label>Project Title</label>
                            <input type="text" name="title" required className={styles.input} />
                        </div>

                        <div className={styles.group}>
                            <label>Description</label>
                            <textarea name="description" className={styles.textarea} rows={4} />
                        </div>

                        <div className={styles.group}>
                            <label>Category</label>
                            <select name="category" className={styles.input}>
                                <option value="academic">Academic Project</option>
                                <option value="studio">Design Studio</option>
                                <option value="technical">Technical Drawing</option>
                            </select>
                        </div>

                        <div className={styles.group}>
                            <label>Year</label>
                            <input type="text" name="year" placeholder="e.g. 2024" className={styles.input} />
                        </div>

                        <div className={styles.group}>
                            <label>Software Used (comma-separated)</label>
                            <input type="text" name="software" placeholder="e.g. AutoCAD, SketchUp, Revit" className={styles.input} />
                        </div>

                        <div className={styles.imagesSection}>
                            <h3>Project Images</h3>
                            {Array.from({ length: imageCount }).map((_, index) => (
                                <div key={index} className={styles.imageGroup}>
                                    <h4>Image {index + 1}</h4>
                                    <div className={styles.group}>
                                        <label>Image File</label>
                                        <input type="file" name={`image-${index}`} accept="image/*" required={index === 0} className={styles.input} />
                                    </div>
                                    <div className={styles.group}>
                                        <label>Caption (optional)</label>
                                        <input type="text" name={`caption-${index}`} placeholder="e.g. Front Elevation" className={styles.input} />
                                    </div>
                                    <div className={styles.group}>
                                        <label>Type</label>
                                        <select name={`type-${index}`} className={styles.input}>
                                            <option value="rendering">Rendering</option>
                                            <option value="drawing">Technical Drawing</option>
                                            <option value="sketch">Sketch</option>
                                            <option value="photo">Photo</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addImageField} className={styles.addImageBtn}>
                                + Add Another Image
                            </button>
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label>
                                <input type="checkbox" name="featured" />
                                <span>Mark as Featured (display on home page)</span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary">Upload Project</button>
                    </form>
                ) : (
                    <form action={createArtwork} className={styles.form}>
                        <div className={styles.group}>
                            <label>Artwork Title</label>
                            <input type="text" name="title" required className={styles.input} />
                        </div>

                        <div className={styles.group}>
                            <label>Description</label>
                            <textarea name="description" className={styles.textarea} rows={3} />
                        </div>

                        <div className={styles.group}>
                            <label>Stage</label>
                            <input type="text" name="stage" placeholder="e.g. Sketch, Lineart, Final" className={styles.input} />
                        </div>

                        <div className={styles.group}>
                            <label>Image</label>
                            <input type="file" name="image" accept="image/*" required className={styles.input} />
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label>
                                <input type="checkbox" name="featured" />
                                <span>Mark as Featured (display on home page)</span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary">Upload Artwork</button>
                    </form>
                )}
            </div>
        </div>
    );
}
