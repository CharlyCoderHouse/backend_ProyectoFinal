import UsersDto from "../dao/DTOs/users.dto.js";

const iniRaiz =  (req, res) => {
    const user = new UsersDto(req.user);
    res.render('home.hbs', { user } );
};

const regRaiz = (req, res) => {
    res.render('register.hbs');
};

const loginRaiz =(req, res) => {
    res.render('login.hbs');
};

const resetRaiz =(req, res) => {
    res.render('resetPassword.hbs');
};

const resetRaizError =(req, res) => {
    res.render('resetPasswordError.hbs');
};

const profileRaiz =(req, res) => {
    const user = new UsersDto(req.user);
    res.render('profile.hbs', { user } );
};

export {
    iniRaiz,
    regRaiz,
    loginRaiz,
    resetRaiz,
    resetRaizError,
    profileRaiz
}