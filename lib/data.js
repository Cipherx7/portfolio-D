import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function getWritings() {
    const filePath = path.join(DATA_DIR, 'writings.json');
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function getWritingBySlug(slug) {
    const writings = await getWritings();
    return writings.find(w => w.slug === slug);
}

export async function saveWriting(writing) {
    const writings = await getWritings();
    // Update if exists, else add
    const index = writings.findIndex(w => w.id === writing.id);
    if (index >= 0) {
        writings[index] = writing;
    } else {
        writings.push(writing);
    }
    await fs.writeFile(path.join(DATA_DIR, 'writings.json'), JSON.stringify(writings, null, 2));
}

export async function getArtwork() {
    const filePath = path.join(DATA_DIR, 'artwork.json');
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveArtwork(art) {
    const artwork = await getArtwork();
    const index = artwork.findIndex(a => a.id === art.id);
    if (index >= 0) {
        artwork[index] = art;
    } else {
        artwork.push(art);
    }
    await fs.writeFile(path.join(DATA_DIR, 'artwork.json'), JSON.stringify(artwork, null, 2));
}

export async function getArchitecture() {
    const filePath = path.join(DATA_DIR, 'architecture.json');
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function getArchitectureById(id) {
    const projects = await getArchitecture();
    return projects.find(p => p.id === id);
}

export async function saveArchitecture(project) {
    const projects = await getArchitecture();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
        projects[index] = project;
    } else {
        projects.push(project);
    }
    await fs.writeFile(path.join(DATA_DIR, 'architecture.json'), JSON.stringify(projects, null, 2));
}

export async function getFeaturedContent() {
    const [writings, artwork, architecture] = await Promise.all([
        getWritings(),
        getArtwork(),
        getArchitecture()
    ]);

    const featured = [];

    // Add featured writings
    writings.filter(w => w.featured).forEach(item => {
        featured.push({
            ...item,
            type: 'writing',
            link: `/writing/${item.slug}`
        });
    });

    // Add featured artwork
    artwork.filter(a => a.featured).forEach(item => {
        featured.push({
            ...item,
            type: 'artwork',
            link: `/artwork/${item.id}`,
            thumbnail: item.steps?.[0]?.image || null
        });
    });

    // Add featured architecture
    architecture.filter(p => p.featured).forEach(item => {
        featured.push({
            ...item,
            type: 'architecture',
            link: `/architecture/${item.id}`,
            thumbnail: item.images?.[0]?.path || null
        });
    });

    // Sort by date (newest first)
    return featured.sort((a, b) => new Date(b.date) - new Date(a.date));
}
