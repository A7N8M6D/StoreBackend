import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure public directory exists
const publicDir = './public';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(publicDir);

    // Check if the directory exists, and create it if not
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Set the destination to the public folder
  },
  filename: function (req, file, cb) {
    console.log('File Name Level 0');
    console.log('file.originalname || file.name', file.originalname, file.name);
    cb(null, file.originalname); // Use the original name of the file
    console.log('File Name Level 1');
  },
});

export const upload = multer({ storage });
