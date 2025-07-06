exports.pageNotFound = (req, res, next) => {
  res
    .status(404)
    .render("404", { pageTitle: "Page Not Found", currentPage: "404", 
      IsLoggedIn : req.session.IsLoggedIn,
      user: req.session.user,
      message : "The page you are looking for does not exist."
    });
};
