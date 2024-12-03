const cloudinary = require('../config/config.cloudinary');

const uploadFile = async (req, res) => {
  try {
    // Ensure file exists
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Cloudinary upload logic
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Pipe the file buffer to the Cloudinary stream
      uploadStream.end(req.file.buffer);
    });

    const result = await uploadPromise;

    // Send response with file metadata
    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

module.exports = uploadFile;
