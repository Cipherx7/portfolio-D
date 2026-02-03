'use server';

export async function verifyPassword(password) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        console.error('ADMIN_PASSWORD not set in environment variables');
        return { success: false, error: 'Server configuration error' };
    }

    if (password === adminPassword) {
        return { success: true };
    }

    return { success: false, error: 'Incorrect password' };
}
