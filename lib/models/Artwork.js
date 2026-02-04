import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
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
    steps: [{
        image: String, // URL from Vercel Blob
        description: String,
        date: Date,
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

const Artwork = mongoose.models.Artwork || mongoose.model('Artwork', artworkSchema);

export default Artwork;
