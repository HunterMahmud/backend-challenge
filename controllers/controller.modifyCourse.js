const Course = require("../models/model.course");
const uploadFile = require("../controllers/controller.fileUpload");

const addVideoToModule = async (req, res) => {
  try {
    const { id, moduleId } = req.params;
    const { title } = req.body;

    // Use the existing file upload API
    const uploadResult = await uploadFile(req, res);
    if (!uploadResult || !uploadResult.file || !uploadResult.file.url) {
      return res.status(400).json({ message: "Video upload failed" });
    }

    // Find the course and module
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Add the video to the module
    const video = { title, url: uploadResult.file.url };
    module.videos.push(video);

    await course.save();

    res.status(201).json({
      message: "Video added successfully",
      video,
    });
  } catch (error) {
    console.error("Add video error:", error);
    res.status(500).json({
      message: "Failed to add video",
      error: error.message,
    });
  }
};

const modifyTheModule = async (req, res) => {
  try {
    const { title, description, modules } = req.body;
    const { file } = req;

    let uploadedVideoUrl = null;

    // Upload video to Cloudinary if a file is provided
    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "videos" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      uploadedVideoUrl = result.secure_url;
    }

    // Find and update the course
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (title) course.title = title;
    if (description) course.description = description;

    // Update modules and videos
    if (modules) {
      const parsedModules = JSON.parse(modules); // Ensure `modules` is parsed correctly
      parsedModules.forEach((updatedModule) => {
        const existingModule = course.modules.id(updatedModule._id);
        if (existingModule) {
          if (updatedModule.moduleName) existingModule.moduleName = updatedModule.moduleName;
          if (updatedModule.videos) {
            updatedModule.videos.forEach((updatedVideo) => {
              const existingVideo = existingModule.videos.id(updatedVideo._id);
              if (existingVideo) {
                existingVideo.title = updatedVideo.title || existingVideo.title;
                existingVideo.url =
                  uploadedVideoUrl || updatedVideo.url || existingVideo.url;
              } else {
                existingModule.videos.push({
                  title: updatedVideo.title,
                  url: uploadedVideoUrl || updatedVideo.url,
                });
              }
            });
          }
        } else {
          course.modules.push(updatedModule);
        }
      });
    }

    const updatedCourse = await course.save();
    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
}

module.exports = {
  addVideoToModule,
  modifyTheModule
};
