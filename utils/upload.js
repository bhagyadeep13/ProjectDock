const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // your cloudinary config

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'ProjectDock',         // Folder in Cloudinary
      resource_type: 'raw',           // Important for PDFs and other non-images
      format: 'pdf',                  // Ensure it's stored as .pdf
    };
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
});

const upload = multer({ storage });

module.exports = upload;
/*
const express = require('express');
const session = require('express-session')
const multer = require('multer');
const { default: mongoose } = require('mongoose');

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
}

const multerOptions = {
  storage, fileFilter
};

const upload = multer(multerOptions);

module.exports = upload;*/