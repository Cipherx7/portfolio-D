'use server';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function verifyUser(username, password) {
    await connectToDatabase();

    if (!username || !password) {
        return { success: false, error: 'Username and password are required' };
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            return { success: true };
        } else {
            return { success: false, error: 'Password incorrect' };
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return { success: false, error: 'Server error' };
    }
}
