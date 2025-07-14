const Project = require("../models/Project");
const fs = require('fs');
const User = require('../models/user')

exports.getAddProject = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "AddNewProject",
    editing: false,
    IsLoggedIn : req.session.IsLoggedIn,
    user: req.session.user,
    toastMessage: null
  });
};

exports.getEditProject = async (req, res, next) => {

  const projectId = req.query.projectId;
  const editing = req.query.editing === "true";

  const project = await Project.findById(projectId)

    if (!project) {
      console.log("Project not found for editing.");
      return res.redirect("/host/host-home-list");
    }
    res.render("host/edit-home", {
      project: project,
      pageTitle: "Edit your Post",
      currentPage: "EditPost",
      editing: editing, 
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user,
      toastMessage: null
    });
  }

exports.getHostProjects = async (req, res, next) => {
      const userId = req.session.user._id;
      const user = await User.findById(userId)
      .populate('Projects')
      console.log("User Projects: h ki nhi ", user.Projects);
      const toastMessage = req.session.toastMessage;
      req.session.toastMessage = null; // Clear the toast message before rendering
      await req.session.save();
      res.render("host/project-list", {
      students: user.Projects,
      pageTitle: "Project List",
      toastMessage: toastMessage,
      currentPage: "Project-List", 
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user
    });
  };

exports.postAddProject = async (req, res, next) => {

  const {title,description,githubLink,deployedLink,technologiesUsed,status,startDate} = req.body;
  console.log(req.body);
  console.log("File: ", req.file);
    if(!req.file) // Check if a file was uploaded
    {
      return res.status(400).send("No file uploaded. Please upload a pdf.");
      // You can also render an error page or redirect to an error route
    }

  const pdf_path = req.file.path; // Get the filename from the uploaded file
  console.log("PDF Path: ", pdf_path);
  const project = new Project({
    title: title,
    description: description,
    githubLink:githubLink,
    deployedLink: deployedLink,
    technologiesUsed: technologiesUsed.split(',').map(tech => tech.trim()), // Split and trim technologies
    comments: [], // Initialize comments as an empty array
    status: status,
    Report: pdf_path, // Store the path to the uploaded PDF
    createdAt: startDate, // Set the current date and time
    Name : req.session.user.firstName + " " + req.session.user.lastName, // Use the user's name from the session 
    Email: req.session.user.email, // Use the user's email from the session
  });

    await project.save();
    console.log("project Saved successfully");
    const userId2 = await req.session.user._id; // Add created by field (user id) to home

    const projectId = project._id; // Use the _id of the newly created home
    const user = await User.findById(userId2);

    console.log("User: ", user, userId2,projectId); // Fetch user print only values of user
    if (!user.Projects.includes(projectId)) {
        user.Projects.push(projectId);
        await user.save();
    }
  req.session.toastMessage = {type: 'success', text: 'Project added successfully!.'};
  await req.session.save();
  console.log("User updated with new project");
  res.redirect("/");
};

exports.postEditProject = async (req, res, next) => {

    const { projectId, title, description, githubLink, deployedLink, technologiesUsed, status, startDate } = req.body;
    const project = await Project.findById(projectId);
  if (project) {
    project.title = title;
    project.description = description;
    project.githubLink = githubLink;
    project.deployedLink = deployedLink;
    project.technologiesUsed = technologiesUsed.split(',').map(tech => tech.trim()); // Split and trim technologies
    if(req.file) // Check if a new file was uploaded
    {
        fs.unlink(project.Report, (err) => {
          if (err) {
            console.error("Error deleting old pdf:", err);
          }
        });
      project.Report = req.file.path; // Update the photo with the new file
      project.status = status;
    }
    // want startDate in 2025-06-28T00:00:00.000+00:00 format
    await project.save();
    req.session.toastMessage = {type: 'info', text: 'Project Edited successfully!.'};
    await req.session.save();
    console.log("Post updated successfully"); 
  }
  else
  {
    console.log("Post not found for editing.");
  }
  res.redirect("/host-project-list");
  }

exports.getDeleteProject = async (req, res, next) => {
  const projectId = req.query.projectId;
  const project = await Project.findByIdAndDelete(projectId);

  if (project) {
    const userId = req.session.user._id; // User ID from session
    const user = await User.findById(userId);

    if (user) {

      user.Projects = user.Projects.filter(
        (pid) => String(pid) !== String(project._id)
      );

      console.log("Project removed from user's projects successfully");

      await user.save();

      req.session.toastMessage = {
        type: 'error',
        text: 'Project deleted successfully!.'
      };

      await req.session.save();
      return res.redirect("/");
    }
  }

  // If project not found or user not found
  res.status(404).render('404', {
    pageTitle: "Error",
    currentPage: "Error",
    IsLoggedIn: req.session.IsLoggedIn,
    user: req.session.user,
    message: "User or project not found"
  });
};

exports.postAddComment = async (req, res, next) => 
  {
  const projectId = req.body.projectId;
  const project = await Project.findById(projectId);
  console.log("Project Ye He:", project, projectId);
  if (!project) {
    console.log("Project not found for adding comment.");
    return res.redirect("/host-project-list");
  }

  const { author, text } = req.body;
  project.comments.push({ author, text });
  await project.save(); 
  req.session.toastMessage = {type: 'success', text: 'Comment added successfully!.'};
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message after rendering
  await req.session.save();

  res.render("Project/post-detail", {
        project: project, 
        pageTitle: "Project Detail",
        currentPage: "project-detail",
        toastMessage: toastMessage,
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
      });
  }

  exports.postDeleteComment = async (req, res, next) => {
  const { author,text,projectId } = req.body;
  console.log(author,text,projectId);
  const project = await Project.findById(projectId);
  if (project) 
    {
      // Find the comment to delete
      const commentIndex = project.comments.findIndex(comment => comment.author === author && comment.text === text);
      if (commentIndex !== -1) {
        // Remove the comment from the comments array
        project.comments.splice(commentIndex, 1);
        await project.save(); // Save the updated project
        console.log("Comment deleted successfully");
        req.session.toastMessage = {type: 'success', text: 'Comment deleted successfully!.'};
      } else {
        console.log("Comment not found for deletion.");
        req.session.toastMessage = {type: 'error', text: 'Comment not found.'};
      }
      await req.session.save();
      const toastMessage = req.session.toastMessage;
      req.session.toastMessage = null; // Clear the toast message after rendering
      await req.session.save();
      res.render("Project/post-detail", {
        project: project, 
        pageTitle: "Project Detail",
        currentPage: "project-detail",
        toastMessage: toastMessage,
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
      });
    } else {
    console.log("Project not found for deleting comment.");
    res.status(404).send("Project not found");
  }
}

exports.getNotification = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  
  if (user) {
    res.render("host/notifications", {
      notifications: user.notifications,
      pageTitle: "Notifications",
      currentPage: "Notifications",
      IsLoggedIn: req.session.IsLoggedIn,
      user: req.session.user,
      toastMessage: null,
    });
  }
  else {
    res.render('404', {
      pageTitle: "Error",
      currentPage: "Error",
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user,
      message: "User not found for notifications",
      toastMessage: null
    });
  }
};