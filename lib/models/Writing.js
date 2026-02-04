import mongoose from 'mongoose';

const writingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'draft', // 'draft' or 'final'
    },
    featured: {
        type: Boolean,
        default: false,
    },
    thumbnail: {
        type: String, // URL to image (Vercel Blob)
    },
    date: {
        type: Date,
        default: Date.now,
    },
    // You can add more fields like tags, etc.
});

// Prevent checking for model existence error during hot reloads
const Writing = mongoose.models.Writing || mongoose.model('Writing', writingSchema);

export default Writing;
