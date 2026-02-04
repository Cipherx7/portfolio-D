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

async function verifyLogin() {
    await loadEnv();
    if (!process.env.MONGODB_URI) { console.log('MISSING URI'); process.exit(1); }

    await mongoose.connect(process.env.MONGODB_URI);

    const username = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASSWORD;

    const logs = [];
    logs.push(`Checking login for user: ${username} with password: ${password}`);

    const user = await User.findOne({ username });
    if (!user) {
        logs.push('User NOT found in DB');
    } else {
        logs.push('User FOUND in DB');
        const isValid = await bcrypt.compare(password, user.password);
        logs.push(`Password valid? ${isValid}`);
    }

    await import('fs').then(fs => fs.promises.writeFile('login-check.log', logs.join('\n')));
    process.exit(0);
}

verifyLogin();
