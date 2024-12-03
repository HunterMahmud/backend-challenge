const express = require("express");
const router = express.Router();
const upload = require('../middlewares/middleware.cloudinary');
const { addVideoToModule, modifyTheModule } = require("../controllers/controller.modifyCourse");
const uploadFile = require('../controllers/controller.fileUpload')

// Update Course by course ID
router.put("/updateCourse/:id", upload.single("video"), uploadFile, modifyTheModule);

// Add Video to Module with File Upload
router.post("/courses/:id/modules/:moduleId/videos", upload.single("video"), uploadFile, addVideoToModule);

module.exports = router;





