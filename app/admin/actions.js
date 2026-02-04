'use server';

import { saveWriting, saveArtwork, saveArchitecture, getWritings, getArtwork, getArchitecture } from '@/lib/data';
import Writing from '@/lib/models/Writing';
import Artwork from '@/lib/models/Artwork';
import Architecture from '@/lib/models/Architecture';
import connectToDatabase from '@/lib/db';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(text) {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
}

export async function createWriting(formData) {
    const title = formData.get('title');
    const content = formData.get('content');
    const status = formData.get('status') || 'draft';
    const featured = formData.get('featured') === 'on';

    if (!title || !content) return { error: 'Missing fields' };

    const id = Date.now().toString();
    const slug = slugify(title);

    await saveWriting({
        id,
        title,
        slug,
        content,
        status,
        featured,
        date: new Date().toISOString()
    });

    revalidatePath('/writing');
    revalidatePath('/');
    redirect('/writing');
}

export async function createArtwork(formData) {
    const title = formData.get('title');
    const description = formData.get('description');
    const progressImage = formData.get('image'); // File
    const progressStage = formData.get('stage'); // 'sketch', 'lineart', 'color', 'final'
    const status = formData.get('status') || 'draft';

    if (!title || !progressImage) return { error: 'Missing fields' };

    const filename = `${Date.now()}-${progressImage.name.replace(/\s/g, '-')}`;

    // Upload to Vercel Blob
    const blob = await put(filename, progressImage, {
        access: 'public',
    });

    const id = Date.now().toString();
    const featured = formData.get('featured') === 'on';

    await saveArtwork({
        id,
        title,
        description,
        featured,
        status,
        steps: [
            {
                stage: progressStage || 'Work In Progress',
                image: blob.url,
                date: new Date().toISOString()
            }
        ]
    });

    revalidatePath('/artwork');
    revalidatePath('/');
    redirect('/artwork');
}

export async function createArchitecture(formData) {
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category'); // 'academic', 'studio', 'technical'
    const year = formData.get('year');
    const software = formData.get('software'); // Comma-separated string
    const status = formData.get('status') || 'draft';

    // Get all uploaded images
    const images = [];
    let imageIndex = 0;

    while (formData.get(`image-${imageIndex}`)) {
        const imageFile = formData.get(`image-${imageIndex}`);
        const caption = formData.get(`caption-${imageIndex}`) || '';
        const type = formData.get(`type-${imageIndex}`) || 'photo';

        if (imageFile && imageFile.size > 0) {
            const filename = `${Date.now()}-${imageIndex}-${imageFile.name.replace(/\s/g, '-')}`;

            // Upload to Vercel Blob
            const blob = await put(filename, imageFile, {
                access: 'public',
            });

            images.push({
                path: blob.url,
                caption,
                type
            });
        }
        imageIndex++;
    }

    if (!title || images.length === 0) {
        return { error: 'Title and at least one image are required' };
    }

    const id = Date.now().toString();
    const softwareArray = software ? software.split(',').map(s => s.trim()).filter(Boolean) : [];
    const featured = formData.get('featured') === 'on';

    await saveArchitecture({
        id,
        title,
        description: description || '',
        category: category || 'academic',
        year: year || new Date().getFullYear().toString(),
        software: softwareArray,
        images,
        featured,
        status,
        date: new Date().toISOString()
    });

    revalidatePath('/architecture');
    revalidatePath('/');
    redirect('/architecture');
}

export async function getAdminContent() {
    const [writings, artwork, architecture] = await Promise.all([
        getWritings({}),
        getArtwork({}),
        getArchitecture({})
    ]);
    return { writings, artwork, architecture };
}

export async function updateStatus(type, id, status) {
    await connectToDatabase();

    let Model;
    if (type === 'writing') Model = Writing;
    else if (type === 'artwork') Model = Artwork;
    else if (type === 'architecture') Model = Architecture;

    if (Model) {
        await Model.findOneAndUpdate(
            { id: id },
            { status: status },
            { strict: false }
        );
        revalidatePath('/');
        revalidatePath(`/${type}`);
        return { success: true };
    }
    return { success: false, error: 'Invalid type' };
}

export async function updateWritingContent(id, content) {
    await connectToDatabase();
    await Writing.findOneAndUpdate(
        { id: id },
        { content: content },
        { strict: false }
    );
    revalidatePath('/writing');
    return { success: true };
}
