// middleware/multer.js
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and PDF allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter
 
}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'cnicFile', maxCount: 1 },
  { name: 'educationFiles', maxCount: 5 },
  { name: 'experienceFiles', maxCount: 5 }
]);