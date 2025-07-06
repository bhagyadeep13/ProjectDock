const express = require('express');
const aboutController = require('../controllers/aboutUs');
const aboutRouter = express.Router();

aboutRouter.get('/about',aboutController.aboutUsPage);

module.exports = aboutRouter;
