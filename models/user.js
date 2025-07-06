const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
  },
  userType: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student'
  },
  Projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
});

// Middleware to clear Projects array for non-students
userSchema.pre('save', function(next) {
  if (this.userType !== 'student') {
    this.Projects = [];
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
