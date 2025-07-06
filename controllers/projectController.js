const User = require("../models/user");
const project = require("../models/Project");

exports.getIndex = async (req, res, next) => {
  const p = await project.find();
  if (!p || p.length === 0) {
    console.log("No projects found");
  }
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message before rendering
  await req.session.save();
  res.render("Project/index", 
    { 
      students: p,
      pageTitle: "Index Page",
      currentPage: "index", 
      toastMessage: toastMessage,
      IsLoggedIn: req.session.IsLoggedIn,
      user: req.session.user
    }
  );
};
exports.PostProjectDetails = async (req, res, next) => 
  {
  const projectId = req.body.studentId;
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message before rendering
  await req.session.save();
  const Pro = await project.findById(projectId)
  console.log("Project: ", await Pro);
    if (!Pro) {  
      console.log("Project not found");
      res.redirect("/");
    }
    else {
      const user = req.session.user;
      if(!user) {
        const toastMessage = {type: 'error', text: 'Please log in first view project details.'};
        req.session.toastMessage = toastMessage;
        await req.session.save();
        res.redirect("/login");
        return;
      }
      res.render("Project/post-detail", {
        project: Pro, 
        pageTitle: "Project Detail",
        currentPage: "project-detail",
        toastMessage: toastMessage,
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
      });
    }
  };
  exports.getAdminLogin = (req, res, next) => {
    const user = req.session.user;
    const userType = user ? user.userType : '';
      res.render("auth/adminLogin",
        {
          userType: userType,
          pageTitle: "Admin Login",
          currentPage: "admin-login",   
          IsLoggedIn : req.session.IsLoggedIn,
          user: req.session.user,
          error: [],
          oldInput: {
            email: '',
            password: '' 
          }
      } );
    }
exports.getAddAdmin = (req, res, next) => {
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message before rendering
  req.session.save();
  const user = req.session.user;
  const userType = user ? user.userType : '';
  res.render("auth/AdminSignUp",
    {   
      userType: userType,
      pageTitle: "Add Admin",
      currentPage: "add-admin", 
      IsLoggedIn : req.session.IsLoggedIn,
      toastMessage: toastMessage,
      user: req.session.user,
      error: [],
      oldInput: {
        email: '',
        password: ''
      }
    });
}
exports.getUpdateStatus = async (req, res, next) =>
{
  const Projects = await project.find();
  console.log("Project ID:", Projects);
  if (!Projects) {
    console.log("Project not found for updating status.");
    return res.redirect("/");
  } 
  const user = req.session.user;
  const userType = user ? user.userType : '';
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message before rendering
  await req.session.save();
  res.render("auth/updateStatus", {
    userType: userType,
    pageTitle: "Update Status",
    currentPage: "update-status",
    toastMessage: toastMessage, 
    IsLoggedIn : req.session.IsLoggedIn,
    user: req.session.user,
    students: Projects,
    error: [],
    oldInput: {
      email: '',
      password: ''
    },
  });
};
exports.postUpdateStatus = async (req, res, next) => {

  console.log("Project ID received:", req.body);
  const projectId = req.body.projectId;
  const status = req.body.status;

  const Project = await project.findById(projectId);
  console.log("Project to update:", Project);
  if (!Project) {
    console.log("Project not found for updating status.");
    return res.redirect("/update-status");      
  }
  Project.status = status;
  await Project.save();
  req.session.toastMessage = {type: 'success', text: 'Status updated successfully!.'};
  await req.session.save();
  res.redirect("/update-status");
};

/*
exports.getPostList = (req, res, next) => {

  const user = req.session.user;
  const userType = user ? user.userType : '';

  Home.find().then((registeredHomes) => {
    res.render("store/post-list", 
      {
      userType: userType,
      registeredHomes: registeredHomes,
      pageTitle: "Post List",
      currentPage: "ViewPost", 
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user
    });
  });
};

exports.getFavouriteList = async (req, res, next) => 
  {
  const userId = req.session.user._id; // user ID is stored in session
  const user = await User.findById(userId)
  .populate('favourites')
  //console.log("User: ",await user); // Fetch user print only values of user
  res.render("store/favourite-list", {
    favouritePosts: user.favourites,
    pageTitle: "Favourite Posts",
    currentPage: "favourites", 
    IsLoggedIn : req.session.IsLoggedIn,
    user: req.session.user
})
}

exports.postAddToFavourite = async (req, res, next) => {

  const userId = req.session.user._id; // user ID is stored in session
  const postId = req.body.postId; // home ID from the request parameters

  const user = await User.findById(userId);
    console.log("User: ",user,postId); // Fetch user print only values of user
     if (!user.favourites.includes(postId)) 
      {
        user.favourites.push(postId);
        console.log("Post added to favourites successfully");
        await user.save();
      }
      else
      {
        console.log("Post not added to favourites, already exists");
      }
    res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const userId = req.session.user._id; // user ID is stored in session
  const homeId = req.params.postId; // home ID from the request parameters
  const user = await User.findById(userId);
  console.log("User: ", user, homeId); // Fetch user print only values of user
  if(!user)
  {
    console.log("User not found");
  }
  else
  {
    user.favourites = user.favourites.filter(
      (favouriteId) => String(favouriteId) !== String(homeId)
    );
    console.log("Post removed from favourites successfully");
    await user.save();
  }
  res.redirect("/favourites");
}

exports.getPostDetails = async (req, res, next) => {

  const postId = req.query.postId;  // Assuming postId is passed as a query parameter
  console.log("Post ID:", postId);
  const user = req.session.user;
  if(!user) {
    res.redirect("/signUp");
    return;
  }
  const userType = await user.userType;
  const post = await Home.findById(postId)
    if (!post) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/post-detail", {
        home: post,
        userType: userType,
        pageTitle: "Post Detail",
        currentPage: "post-detail", 
        IsLoggedIn : req.session.IsLoggedIn,
        user: req.session.user
      });
    }
  }*/
