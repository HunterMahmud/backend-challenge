const express = require('express');
const router = express.Router();
const upload = require('../middlewares/middleware.cloudinary');
const uploadFile = require('../controllers/controller.fileUpload');
const authentication = require("../middlewares/middleware.authorization")


// Single file upload route with authentication
router.post(
  '/upload', 
  authentication, //addding the token authentication
  upload.single('file'), 
  uploadFile
);

module.exports = router;