import multer from "multer";

// Set up Multer storage (temporary storage in `uploads/` folder)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
