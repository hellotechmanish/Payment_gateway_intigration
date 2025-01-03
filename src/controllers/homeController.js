exports.getHomePage = (req, res) => {
    res.render('index', { title: 'Welcome to MVC Express App' });
};
