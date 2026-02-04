import mongoose from 'mongoose';

const architectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    year: {
        type: String,
    },
    software: {
        type: [String],
        default: [],
    },
    images: [{
        path: String, // URL from Vercel Blob
        caption: String,
        type: { type: String, default: 'render' } // e.g., 'sketch', 'render', 'diagram'
    }],
    featured: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['draft', 'final'],
        default: 'draft',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Architecture = mongoose.models.Architecture || mongoose.model('Architecture', architectureSchema);

export default Architecture;
