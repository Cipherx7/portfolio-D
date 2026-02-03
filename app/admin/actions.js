'use server';

import { saveWriting, saveArtwork, saveArchitecture } from '@/lib/data';
import path from 'path';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(text) {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
}

export async function createWriting(formData) {
    const title = formData.get('title');
    const content = formData.get('content');
    const status = formData.get('status'); // 'draft' or 'final'
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

    // Note: For a real "Progress" tracker, we might want to append to an existing artwork.
    // But for now, let's assume we upload a NEW artwork entry or update an existing one?
    // Let's keep it simple: Create New Artwork Entry.
    // Actually, user wants "progress of my artwork".
    // Maybe we can upload multiple images?
    // Let's just store an array of progress steps: { stage, imagePath, date }.
    // For simplicity MVP: Upload a single image as "Final" or "Progress".

    // Revised approach: Create a new Artwork Item with ONE initial image.
    // Future updates could add more images to it.

    if (!title || !progressImage) return { error: 'Missing fields' };

    const buffer = Buffer.from(await progressImage.arrayBuffer());
    const filename = `${Date.now()}-${progressImage.name.replace(/\s/g, '-')}`;
    const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

    await fs.writeFile(uploadPath, buffer);

    const imagePath = `/uploads/${filename}`;

    // For this simple version, each upload is a new "post". 
    // Ideally, we'd select an existing artwork to add progress to.
    // But let's build the "New Artwork" flow first.

    const id = Date.now().toString();
    const featured = formData.get('featured') === 'on';

    await saveArtwork({
        id,
        title,
        description,
        featured,
        steps: [
            {
                stage: progressStage || 'Work In Progress',
                image: imagePath,
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

    // Get all uploaded images
    const images = [];
    let imageIndex = 0;

    while (formData.get(`image-${imageIndex}`)) {
        const imageFile = formData.get(`image-${imageIndex}`);
        const caption = formData.get(`caption-${imageIndex}`) || '';
        const type = formData.get(`type-${imageIndex}`) || 'photo';

        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${Date.now()}-${imageIndex}-${imageFile.name.replace(/\s/g, '-')}`;
            const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

            await fs.writeFile(uploadPath, buffer);

            images.push({
                path: `/uploads/${filename}`,
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
        date: new Date().toISOString()
    });

    revalidatePath('/architecture');
    revalidatePath('/');
    redirect('/architecture');
}
