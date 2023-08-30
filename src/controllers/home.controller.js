import UsersDto from "../dao/DTOs/users.dto.js";

const iniHome =  (req, res) => {
    const user = new UsersDto(req.user);
    res.render('home.hbs', { user } );
};

export {
    iniHome
}