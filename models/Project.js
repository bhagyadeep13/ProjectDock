const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  githubLink: {
    type: String,
  },
  deployedLink: {
    type: String,
    required: [true, 'Deployed link is required'],
  },
  technologiesUsed: [String],

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  Report:
  {
    type: String,
    required: [true, 'Report is required'],
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  Name: {
    type: String,
    ref: 'User',
    required: [true, 'Name is required']  
  },
  comments: [
    {
      author: String,
      text: String,
    }
  ],
  Email: {
    type: String,   
    required: [true, 'Email is required']
  }
});

module.exports = mongoose.model('Project', ProjectSchema);