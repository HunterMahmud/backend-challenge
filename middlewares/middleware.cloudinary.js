const multer = require('multer');

// File filter to validate file types and sizes
const fileFilter = (req, file, cb) => {
  
  // Allowed file types
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'application/pdf', 
    'video/mp4', 
    'audio/mpeg'
  ];

  // Max file size (5MB)
  const maxSize = 5 * 1024 * 1024; 

  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, MP4, and MP3 are allowed.'), false);
  }

  // Check file size
  if (file.size > maxSize) {
    return cb(new Error('File size exceeds 5MB limit.'), false);
  }

  cb(null, true);
};

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {    fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;

