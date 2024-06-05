const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  basicInfo: {
    type: {
      projectName: {
        type: String,
        required: true
      },
      projectDescription: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      projectImages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Photo',
          required: true
        }
      ],
      coverImage: {
        type: Number,
        required: true
      },
      targetAmount: {
        type: Number,
        required: true
      },
      campaignDuration: {
        type: Number,
        required: true
      },
      location: {
        lat: {
          type: Number,
        },
        lng: {
          type: Number,   
        }
      },
      rewardPercentage: {
        type: Number,
        required: true
      }
    },
    required: true
  },
  category: {
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true
    }
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
