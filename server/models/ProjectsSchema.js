const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  basicInfo: {
    type: Object,
    required: true
  },
  rejectionReason: {
    type: String
  },
  status: {
    type: String,
    default: 'pending' 
  },
  approvalDate: {
    type: Date
  },
  expiredDate: {
    type: Date
  }
});

const Project = mongoose.model('Project', ProjectSchema, 'projects');

module.exports = Project;
