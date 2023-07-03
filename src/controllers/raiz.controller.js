const iniRaiz =  (req, res) => {
    res.render('home.hbs', {
        user: req.user
    });
};

const regRaiz = (req, res) => {
    res.render('register.hbs');
};

const loginRaiz =(req, res) => {
    res.render('login.hbs');
};

const profileRaiz =(req, res) => {
    res.render('profile.hbs', {
        user: req.user,
    });
};

export {
    iniRaiz,
    regRaiz,
    loginRaiz,
    profileRaiz
}