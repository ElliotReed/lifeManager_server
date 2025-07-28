import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, '../public');
const dest = path.join(__dirname, '../dist/public');

fs.cp(src, dest, { recursive: true }, (err) => {
    if (err) {
        console.error('Error copying public files:', err);
    } else {
        console.log('Public files copied successfully.');
    }
});
