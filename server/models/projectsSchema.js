const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  
});

const basicInfoSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  projectImages: {
    type: [String],
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  campaignDuration: {
    type: Number,
    required: true,
  }
});

const projectSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  basicInfo: {
    type: basicInfoSchema,
    required: true,
  },
  rewards: {
    type: [rewardSchema],
    default: [],
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
