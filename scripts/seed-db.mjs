import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// Load environment variables from .env.local
import { readFile } from 'fs/promises';

async function loadEnv() {
    try {
        const envFile = await readFile(path.resolve(process.cwd(), '.env.local'), 'utf-8');
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    } catch (e) {
        console.error('Error loading .env.local', e);
    }
}

// Minimal Schema definitions valid for this script (copying to avoid import issues due to module resolution in standalone scripts sometimes)
// Ideally we would import, but let's just define inline for the seed script to be self-contained and robust.
const writingSchema = new mongoose.Schema({
    title: String,
    slug: { type: String, unique: true },
    content: String,
    status: { type: String, default: 'draft' },
    featured: { type: Boolean, default: false },
    date: Date,
    id: String // Keeping original ID for reference if needed, though we rely on _id mostly
});

const architectureSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    year: String,
    software: [String],
    images: [{ path: String, caption: String, type: String }],
    featured: { type: Boolean, default: false },
    date: Date,
    id: String
});

const artworkSchema = new mongoose.Schema({
    title: String,
    description: String,
    steps: [{ image: String, description: String, date: Date }],
    featured: { type: Boolean, default: false },
    date: Date,
    id: String
});

const Writing = mongoose.models.Writing || mongoose.model('Writing', writingSchema);
const Architecture = mongoose.models.Architecture || mongoose.model('Architecture', architectureSchema);
const Artwork = mongoose.models.Artwork || mongoose.model('Artwork', artworkSchema);

async function migrate() {
    await loadEnv();

    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not defined');
        process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const DATA_DIR = path.resolve(process.cwd(), 'data');

    // Migrate Writings
    try {
        const writingsData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'writings.json'), 'utf-8'));
        console.log(`Found ${writingsData.length} writings.`);

        for (const item of writingsData) {
            const exists = await Writing.findOne({ slug: item.slug });
            if (!exists) {
                await Writing.create(item);
                console.log(`Migrated writing: ${item.title}`);
            } else {
                console.log(`Skipped existing writing: ${item.title}`);
            }
        }
    } catch (e) {
        console.log('No writings found or error reading writings.json', e.message);
    }

    // Migrate Architecture
    try {
        const archData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'architecture.json'), 'utf-8'));
        console.log(`Found ${archData.length} architecture projects.`);

        for (const item of archData) {
            // Check duplicate by title or id
            const exists = await Architecture.findOne({ title: item.title });
            if (!exists) {
                await Architecture.create(item);
                console.log(`Migrated project: ${item.title}`);
            } else {
                console.log(`Skipped existing project: ${item.title}`);
            }
        }
    } catch (e) {
        console.log('No architecture found or error reading', e.message);
    }

    // Migrate Artwork
    try {
        const artworkData = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'artwork.json'), 'utf-8'));
        console.log(`Found ${artworkData.length} artworks.`);

        for (const item of artworkData) {
            const exists = await Artwork.findOne({ title: item.title });
            if (!exists) {
                await Artwork.create(item);
                console.log(`Migrated artwork: ${item.title}`);
            } else {
                console.log(`Skipped existing artwork: ${item.title}`);
            }
        }
    } catch (e) {
        console.log('No artwork found or error reading', e.message);
    }

    console.log('Migration complete.');
    process.exit(0);
}

migrate().catch(console.error);
