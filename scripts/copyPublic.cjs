const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../public');
const dest = path.join(__dirname, '../dist/public');

fs.cp(src, dest, { recursive: true }, (err) => {
    if (err) {
        console.error('Error copying public files:', err);
    } else {
        console.log('Public files copied successfully.');
    }
});
