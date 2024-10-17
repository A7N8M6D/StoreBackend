import multer from "multer";

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // Correctly spelled 'destination'
    },
    filename: function (req, file, cb) {
        console.log(file.originalname)
        cb(null, file.originalname); // You can modify this to add timestamps or unique identifiers if needed
    }
});

// Create the multer upload instance
export const upload = multer({ storage });
