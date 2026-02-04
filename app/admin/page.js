'use client';
import { useState, useEffect } from 'react';
import { createWriting, createArtwork, createArchitecture, getAdminContent, updateStatus, updateWritingContent } from './actions';
import LoginForm from './LoginForm';
import styles from './admin.module.css';
import { LogOut, CheckCircle, XCircle, Edit } from 'lucide-react';
import RichEditor from '../../components/RichEditor';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('manage'); // Default to manage
    const [contentList, setContentList] = useState({ writings: [], artwork: [], architecture: [] });
    const [imageCount, setImageCount] = useState(1);
    const [editorContent, setEditorContent] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const authStatus = sessionStorage.getItem('admin_authenticated');
        setIsAuthenticated(authStatus === 'true');
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Fetch content when authenticated and on manage tab
        if (isAuthenticated && activeTab === 'manage') {
            loadContent();
        }
    }, [isAuthenticated, activeTab]);

    const loadContent = async () => {
        const data = await getAdminContent();
        setContentList(data);
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_authenticated');
        setIsAuthenticated(false);
    };

    const toggleStatus = async (type, id, currentStatus) => {
        const newStatus = currentStatus === 'final' ? 'draft' : 'final';
        await updateStatus(type, id, newStatus);

        // Optimistic update or reload
        loadContent();
    };

    const startEditWriting = (writing) => {
        setEditingItem(writing);
        setEditorContent(writing.content || '');
    };

    const saveEditorContent = async () => {
        if (!editingItem) return;
        await updateWritingContent(editingItem.id, editorContent);
        setEditingItem(null);
        setEditorContent('');
        loadContent();
    };

    if (isLoading) return <div className={styles.container}><p>Loading...</p></div>;
    if (!isAuthenticated) return <LoginForm onLoginSuccess={handleLoginSuccess} />;

    // Helper for tabs
    const TabButton = ({ id, label }) => (
        <button
            className={`${styles.tab} ${activeTab === id ? styles.activeTab : ''}`}
            onClick={() => {
                setActiveTab(id);
                if (id !== 'manage') setEditingItem(null);
                if (id === 'architecture') setImageCount(1);
            }}
        >
            {label}
        </button>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className={styles.tabs}>
                <TabButton id="manage" label="Manage Content" />
                <TabButton id="writing" label="New Writing" />
                <TabButton id="architecture" label="New Architecture" />
                <TabButton id="artwork" label="New Artwork" />
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                {activeTab === 'manage' && (
                    <>
                        {editingItem ? (
                            <div className={styles.editContainer}>
                                <h2>Editing: {editingItem.title}</h2>
                                <RichEditor value={editorContent} onChange={setEditorContent} />
                                <div className={styles.actions}>
                                    <button onClick={saveEditorContent} className="btn btn-primary">Save Changes</button>
                                    <button onClick={() => setEditingItem(null)} className="btn">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.manageList}>
                                <h2>Writing</h2>
                                <ul>
                                    {contentList.writings.map(w => (
                                        <li key={w.id} className={styles.listItem}>
                                            <span>{w.title}</span>
                                            <div className={styles.listActions}>
                                                <span className={`${styles.statusBadge} ${w.status === 'final' ? styles.statusFinal : styles.statusDraft}`}>
                                                    {w.status?.toUpperCase() || 'DRAFT'}
                                                </span>
                                                <button onClick={() => toggleStatus('writing', w.id, w.status)} className={styles.iconBtn}>
                                                    {w.status === 'final' ? <XCircle color="red" /> : <CheckCircle color="green" />}
                                                </button>
                                                <button onClick={() => startEditWriting(w)} className={styles.iconBtn}>
                                                    <Edit size={18} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <h2>Architecture</h2>
                                <ul>
                                    {contentList.architecture.map(a => (
                                        <li key={a.id} className={styles.listItem}>
                                            <span>{a.title}</span>
                                            <div className={styles.listActions}>
                                                <span className={`${styles.statusBadge} ${a.status === 'final' ? styles.statusFinal : styles.statusDraft}`}>
                                                    {a.status?.toUpperCase() || 'DRAFT'}
                                                </span>
                                                <button onClick={() => toggleStatus('architecture', a.id, a.status)} className={styles.iconBtn}>
                                                    {a.status === 'final' ? <XCircle color="red" /> : <CheckCircle color="green" />}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <h2>Artwork</h2>
                                <ul>
                                    {contentList.artwork.map(a => (
                                        <li key={a.id} className={styles.listItem}>
                                            <span>{a.title}</span>
                                            <div className={styles.listActions}>
                                                <span className={`${styles.statusBadge} ${a.status === 'final' ? styles.statusFinal : styles.statusDraft}`}>
                                                    {a.status?.toUpperCase() || 'DRAFT'}
                                                </span>
                                                <button onClick={() => toggleStatus('artwork', a.id, a.status)} className={styles.iconBtn}>
                                                    {a.status === 'final' ? <XCircle color="red" /> : <CheckCircle color="green" />}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'writing' && (
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
                            {/* Rich Editor Integration via hidden input */}
                            <RichEditor value={editorContent} onChange={setEditorContent} />
                            <input type="hidden" name="content" value={editorContent} />
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label>
                                <input type="checkbox" name="featured" />
                                <span>Mark as Featured</span>
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={() => setTimeout(() => setEditorContent(''), 1000)}>
                            Publish Writing
                        </button>
                    </form>
                )}

                {activeTab === 'architecture' && (
                    <form action={createArchitecture} className={styles.form}>
                        <div className={styles.group}>
                            <label>Project Title</label>
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
                            <label>Software Used</label>
                            <input type="text" name="software" placeholder="e.g. AutoCAD, SketchUp" className={styles.input} />
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
                                        <label>Caption</label>
                                        <input type="text" name={`caption-${index}`} className={styles.input} />
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => setImageCount(c => c + 1)} className={styles.addImageBtn}>+ Add Image</button>
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label>
                                <input type="checkbox" name="featured" />
                                <span>Mark as Featured</span>
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">Upload Project</button>
                    </form>
                )}

                {activeTab === 'artwork' && (
                    <form action={createArtwork} className={styles.form}>
                        <div className={styles.group}>
                            <label>Artwork Title</label>
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
                                <span>Mark as Featured</span>
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">Upload Artwork</button>
                    </form>
                )}
            </div>
        </div>
    );
}
