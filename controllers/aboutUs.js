exports.aboutUsPage = (req, res, next) => {
  const toastMessage = req.session.toastMessage;
  req.session.toastMessage = null; // Clear the toast message after displaying it
  res.render('Project/aboutUs', {
    pageTitle: 'About Us',
    currentPage: 'AboutUs',
    projects: [], // Assuming you want to display some projects, you can fetch them from the database
    IsLoggedIn: req.session.IsLoggedIn,
    user: req.session.user,
    toastMessage: toastMessage || '', // Use an empty string if toastMessage is null
    error: [],  
    oldInput: {
      name: '',
      email: '',
      message: ''
    }
  });
};
