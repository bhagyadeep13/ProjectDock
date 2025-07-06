// External Module
const express = require("express");
const ProjectRouter = express.Router();

// Local Module
const projectController = require("../controllers/projectController");

ProjectRouter.get("/", projectController.getIndex);
ProjectRouter.post("/projectDetails", projectController.PostProjectDetails);
//ProjectRouter.get("/post-list", projectController.getPostList);
ProjectRouter.get("/admin-login", projectController.getAdminLogin);
ProjectRouter.get("/add-admin", projectController.getAddAdmin);
ProjectRouter.get("/update-status", projectController.getUpdateStatus);
ProjectRouter.post("/update-status", projectController.postUpdateStatus);
/*ProjectRouter.post("/favourites", projectController.postAddToFavourite);
ProjectRouter.post("/favourites/delete/:postId", projectController.postRemoveFromFavourite);
// here this _id in link is passed as req.params._id*/

module.exports = ProjectRouter;
