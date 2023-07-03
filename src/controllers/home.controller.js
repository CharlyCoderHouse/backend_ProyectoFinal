const iniHome =  (req, res) => {
    res.render('home.hbs', {
        user: req.user
    });
};

export {
    iniHome
}