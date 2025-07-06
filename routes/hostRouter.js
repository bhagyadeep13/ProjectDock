// External Module
const express = require("express");
const hostRouter = express.Router();
const upload = require("../utils/upload");
// Local Module
const hostController = require("../controllers/hostController");

// Only apply on the route that needs file upload
hostRouter.get("/add-project", hostController.getAddProject);
hostRouter.post("/add-project", upload.single("pdf"), hostController.postAddProject);
hostRouter.get("/host-project-list", hostController.getHostProjects);
hostRouter.get("/edit-project", hostController.getEditProject);
hostRouter.post("/edit-project", upload.single("pdf"), hostController.postEditProject);
hostRouter.get("/delete-project", hostController.getDeleteProject);
hostRouter.post("/add-comment", hostController.postAddComment);
hostRouter.post("/delete-comment", hostController.postDeleteComment);

module.exports = hostRouter;