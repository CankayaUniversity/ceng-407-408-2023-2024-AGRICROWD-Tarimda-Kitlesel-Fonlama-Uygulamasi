const mongoose = require('mongoose');

const pendingProjectSchema = new mongoose.Schema({
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
  }
});

const PendingProject = mongoose.model('PendingProject', pendingProjectSchema);

module.exports = PendingProject;
