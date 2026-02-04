import mongoose from 'mongoose';
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

async function checkAdmin() {
    await loadEnv();
    if (!process.env.MONGODB_URI) { console.log('MISSING URI'); process.exit(1); }

    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ username: 'admin' });
    console.log('Admin User Found:', !!user);
    if (user) {
        console.log('Password Hash:', user.password);
    }
    process.exit(0);
}

checkAdmin();
