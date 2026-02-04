import connectToDatabase from '@/lib/db';
import Writing from '@/lib/models/Writing';
import Architecture from '@/lib/models/Architecture';
import Artwork from '@/lib/models/Artwork';

// Helper to sanitize data (convert _id to string, dates to ISO strings)
function sanitize(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    obj._id = obj._id.toString();
    if (obj.date) obj.date = obj.date.toISOString();
    return obj;
}

export async function getWritings(filters = {}) {
    await connectToDatabase();
    const docs = await Writing.find(filters).sort({ date: -1 });
    return docs.map(sanitize);
}

export async function getWritingBySlug(slug) {
    await connectToDatabase();
    const doc = await Writing.findOne({ slug });
    return sanitize(doc);
}

export async function saveWriting(writing) {
    await connectToDatabase();
    // Use id to find existing, or create new.
    // Ensure we handle the case where id might be missing for new items
    if (!writing.id) {
        writing.id = Date.now().toString(); // Generate ID if missing, matching old behavior
    }

    // writing might contain _id if it came from DB, remove it to avoid immutable field error on update if mismatched
    const { _id, ...cleanData } = writing;

    await Writing.findOneAndUpdate(
        { id: cleanData.id },
        cleanData,
        { upsert: true, new: true, strict: false }
    );
}

export async function getArtwork(filters = {}) {
    await connectToDatabase();
    const docs = await Artwork.find(filters).sort({ date: -1 });
    return docs.map(sanitize);
}

export async function saveArtwork(art) {
    await connectToDatabase();
    if (!art.id) art.id = Date.now().toString();
    const { _id, ...cleanData } = art;
    await Artwork.findOneAndUpdate(
        { id: cleanData.id },
        cleanData,
        { upsert: true, new: true, strict: false }
    );
}

export async function getArchitecture(filters = {}) {
    await connectToDatabase();
    const docs = await Architecture.find(filters).sort({ date: -1 });
    return docs.map(sanitize);
}

export async function getArchitectureById(id) {
    await connectToDatabase();
    const doc = await Architecture.findOne({ id });
    return sanitize(doc);
}

export async function saveArchitecture(project) {
    await connectToDatabase();
    if (!project.id) project.id = Date.now().toString();
    const { _id, ...cleanData } = project;
    await Architecture.findOneAndUpdate(
        { id: cleanData.id },
        cleanData,
        { upsert: true, new: true, strict: false }
    );
}

export async function getFeaturedContent() {
    await connectToDatabase();
    const [writings, artwork, architecture] = await Promise.all([
        Writing.find({ featured: true, status: 'final' }).lean(),
        Artwork.find({ featured: true, status: 'final' }).lean(),
        Architecture.find({ featured: true, status: 'final' }).lean()
    ]);

    const featured = [];

    // Add featured writings
    writings.forEach(item => {
        featured.push({
            ...sanitize(item),
            type: 'writing',
            link: `/writing/${item.slug}`
        });
    });

    // Add featured artwork
    artwork.forEach(item => {
        featured.push({
            ...sanitize(item),
            type: 'artwork',
            link: `/artwork/${item.id}`,
            thumbnail: item.steps?.[0]?.image || null
        });
    });

    // Add featured architecture
    architecture.forEach(item => {
        featured.push({
            ...sanitize(item),
            type: 'architecture',
            link: `/architecture/${item.id}`,
            thumbnail: item.images?.[0]?.path || null
        });
    });

    // Sort by date (newest first)
    return featured.sort((a, b) => new Date(b.date) - new Date(a.date));
}
