const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  url: String, // Video URL from the file upload API that we have made before
});

const moduleSchema = new mongoose.Schema({
  moduleName: String,
  videos: [videoSchema], // Array of videos because each module can contain multiple videos
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  modules: [moduleSchema], // Array of modules because each course can contains multiple modules
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
