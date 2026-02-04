import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { readFile } from 'fs/promises';

async function loadEnv() {
    try {
        const envFile = await readFile(path.resolve(process.cwd(), '.env.local'), 'utf-8');
        envFile.split('\n').forEach(line => {
            const delimiterIndex = line.indexOf('=');
            if (delimiterIndex > 0) {
                const key = line.slice(0, delimiterIndex).trim();
                const value = line.slice(delimiterIndex + 1).trim();
                if (key && value && !key.startsWith('#')) {
                    process.env[key] = value;
                }
            }
        });
    } catch (e) {
        console.error('Error loading .env.local', e);
    }
}

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
    await loadEnv();

    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not defined');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const username = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        console.error('Error: ADMIN_USER or ADMIN_PASSWORD not found in .env.local');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Admin user already exists. Updating password...');
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log('Admin password updated.');
        } else {
            await User.create({
                username,
                password: hashedPassword,
            });
            console.log(`Admin user created. Username: ${username}, Password: ${password}`);
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
        await fs.promises.writeFile('admin-status.txt', 'Error: ' + error.message);
    }
    await import('fs').then(fs => fs.promises.writeFile('admin-status.txt', 'Success'));
    process.exit(0);
}

createAdmin();
