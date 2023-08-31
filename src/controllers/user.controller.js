import { getAllUser as getAllUserService,
    getUser as getUserService, 
    addUser as addUserService, 
    updateUser as updateUserService, 
    updatePushUser as updatePushUserService,
    deleteUserById as deleteUserByIdService,
    deleteAllUser as deleteAllUserService } from '../services/user.service.js';
import { responseMessages } from '../helpers/proyect.helpers.js';
import { generateToken, generateTokenResetPass, createHash, isValidPassword } from '../utils/utils.js';
import { PRIVATE_COOKIE } from '../helpers/proyect.constants.js';
import UsersDto from '../dao/DTOs/users.dto.js';
import { postCart } from '../services/carts.service.js';
import { loginNotification } from '../utils/custom-html.js';
import { sendEmail } from "../services/mail.js";
import moment from "moment";

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await getUserService({ email });
        
        if (exists) {
            req.logger.warning(`registerUser = ` + responseMessages.user_exists); 
            return res.status(400).send({ status: 'error', error: responseMessages.user_exists });
        }    

        const cartId = await postCart();

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cartId
        }

        await addUserService(user);

        const accessToken = generateToken(user);

        res.send({ status: 'success', message: responseMessages.user_register_ok, access_token: accessToken })
    } catch (error) {
        req.logger.error(`registerUser = ` + error.message); 
        res.status(500).send({ status: 'error', error: error.message });
    }
}; 

const loginUser =  async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await getUserService({ email });

        if (!user) {
            req.logger.warning(`loginUser = ` + responseMessages.incorrect_user); 
            return res.status(400).send({ status: 'error', error: responseMessages.incorrect_user });
        }
        if (!isValidPassword(user, password)) {
            req.logger.warning(`loginUser = ` + responseMessages.incorrect_password); 
            return res.status(401).send({ status: 'error', error: responseMessages.incorrect_password })
        }
        req.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age, 
            role: "user",
            cartId: user.cart._id
        }
        
        if(user.email === 'adminCoder@coder.com') {
            //&& password === 'adminCod3r123'
            req.user.role = "admin";
        }

        const accessToken = generateToken(user);

        // Guardo la ultima conexión
        const userId = String(user._id)
        const newLastConnect =  moment().format("DD/MM/YYYY hh:mm:ss");
        await updateUserService(userId, { "last_connection": newLastConnect });

        res.cookie(
            PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
        ).send({ status: 'success', message: responseMessages.login_ok });

    } catch (error) {
        req.logger.error(`loginUser = ` + error.message);
        res.status(500).send({ status: 'error', error });
    }
};

const logoutUser = async (req, res) => {
    // Guardo la ultima conexión
    const userId = String(req.user._id)
    const newLastConnect =  moment().format("DD/MM/YYYY hh:mm:ss");
    await updateUserService(userId, { "last_connection": newLastConnect });

    res.clearCookie(PRIVATE_COOKIE);
    res.redirect('/login')
};

const gitUser = async (req, res) => {
    res.redirect('/');
    //res.send({ status: "success", mesage: responseMessages.user_register_ok})
};

const gitCallbackUser = async (req, res) => {
    req.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email, 
        role: "user", 
    };

    if(req.user.email === 'adminCoder@coder.com' ) {
        req.user.role = "admin";
    }
    const accessToken = generateToken(req.user);
    
    // Guardo la ultima conexión
    const userId = String(user._id)
    const newLastConnect =  moment().format("DD/MM/YYYY hh:mm:ss");
    await updateUserService(userId, { "last_connection": newLastConnect });

    res.cookie(
        PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    )
    
    res.redirect('/');
};

const currentUser = (req, res) => {
    const user = new UsersDto(req.user);
    res.send({ status: 'success', payload: user });
};

const passLink = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await getUserService({ email });

        if (!user) {
            req.logger.warning(`loginUser = ` + responseMessages.incorrect_user); 
            return res.status(400).send({ status: 'error', error: responseMessages.incorrect_user });
        }

        const accessToken = generateTokenResetPass(user);

        const link = `http://localhost:8080/api/sessions/linkPassword?token=${accessToken}`
        const mail = {
            to: user.email,
            subject: 'Reseteo de Contraseña',
            html: loginNotification(link)
        }
        
        await sendEmail(mail);

        res.send({ status: 'success', message: 'link OK', access_token: accessToken });
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }

};

const linkPass = (req, res) => {

    const accessToken = req.query.token;

    res.cookie(
        PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    );

    res.render('linkPassword.hbs');

};

const putPass = async (req, res) =>{
    try {
        const { password } = req.body;
        const email = req.user.email;
        const user = await getUserService({ email });

        if (isValidPassword(user, password)) {
            req.logger.warning(`User = ` + responseMessages.invalid_password); 
            return res.status(401).send({ status: 'error', error: responseMessages.invalid_password })
        } else {
            const id = String(user._id)
            const newPass =  createHash(password)
            const result = await updateUserService(id, { "password": newPass });
            
            //Valido que se realizo el UPDATE
            if (result.acknowledged & result.modifiedCount!==0) {
                const response = { status: "Success", payload: `La contraseña fue cambiada con exito!`};       
                //muestro resultado y elimino la cookie
                res.clearCookie(PRIVATE_COOKIE);
                res.status(200).json(response);
            } else {
                req.logger.error(`putPass = Error no se pudo actualizar el producto, verifique los datos ingresados`);
                //muestro resultado error
                res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el producto, verifique los datos ingresados"});
            };   
        }
    } catch(error) {
        res.status(500).send({ status: 'error', error });
    }
};

const changeRol = async (req, res) => {
    try {
        
        const id = String(req.params.uid);
        const role = req.body
        
        const result = await updateUserService(id, role);
        
        //Valido que se realizo el UPDATE
        if (result.acknowledged & result.modifiedCount!==0) {
            const response = { status: "Success", payload: `El role fue cambiado con exito!`};       
            //muestro resultado
            res.status(200).json(response);
        } else {
            req.logger.error(`ChangeRol = No se pudo modificar el rol`);
            //muestro resultado error
            res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el usuario, verifique los datos ingresados"});
        };   
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
};

const deleteUser = async (req, res) => {
    try {
        
        const id = String(req.params.uid);
        
        const result = await deleteUserByIdService(id);
        
        //Valido que se realizo el UPDATE
        if (result.acknowledged & result.deletedCount!==0) {
            const response = { status: "Success", payload: `El usuario fue eliminado con Exito!`};       
            //muestro resultado
            res.status(200).json(response);
        } else {
            req.logger.error(`deleteUser = No se pudo eliminar el user`);
            //muestro resultado error
            res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo eliminar el usuario, verifique los datos ingresados"});
        };   
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
};

const insertFile = async (req, res) => {

    const id = String(req.params.uid); 
    
    const newDocument = [];

    if (!req.files) {
        return res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el usuario, porque no hay archivos"});
    }
    
    if (req.files.products) {
        return res.status(200).json({ status: "Success", data: "Se almaceno la imagen del producto correctamente"});
    }

    if (req.files.profiles) {

        req.files.profiles.forEach(element => {    
            const filename = element.filename;
            const name = element.fieldname
            const obj1 = {
                name: name,
                reference: `http://localhost:8080/data/${name}/${filename}`
            }
            newDocument.push(obj1)
        });
    };

    if (req.files.documents) {
        const { type } = req.body;
        
        req.files.documents.forEach(element => {
            const filename = element.filename;
            let name = element.fieldname;

            if (type){
                name = String(type);
                updatePushUserService(id, {status: name});
            };

            const obj2 = {
                name: name,
                reference: `http://localhost:8080/data/${element.fieldname}/${filename}`
            }
            newDocument.push(obj2)
        });
    }

    const result = await updatePushUserService(id, {documents: newDocument});
    
    //Valido que se realizo el UPDATE
    if (result.acknowledged & result.modifiedCount!==0) {
        const response = { status: "Success", payload: `Se adjunto el archivo al usuario!`};       
        //muestro resultado
        res.status(200).json(response);
    } else {
        req.logger.error(`insertFile = No se pudo ingresar la imagen`);
        //muestro resultado error
        res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el usuario, verifique los datos ingresados"});
    }; 
}

const getUsersAll = async(req, res) => {
    try {
        const usersAll = await getAllUserService();
        const users = [];
        usersAll.forEach(element => {
            users.push(new UsersDto(element))
        })
          
        const response ={ status: "Success", payload: users};
        users.isValid = users.length > 0
        // VISTA DE USUARIOS
        //res.status(200).json(response);
        res.render("users.hbs", { users });
    } catch (error) {
        req.logger.error(`getUsersAll = No se pudieron mostrar los usuarios!`);
        const response = { status: "NOT FOUND", payload: 'No se pudieron mostrar los usuarios', error };
        res.status(404).send(response);
    };
};

const deleteAllUser = async (req, res) => {
    try {
        const { day } = req.body;
    
        const condition = moment().subtract(day, 'days').format("DD/MM/YYYY hh:mm:ss");
        console.log(condition);

        const usersDelete = await deleteAllUserService({ last_connection: {$lt: condition}});
        
        console.log(usersDelete);
        //Valido que se realizo el UPDATE
        //if (result.acknowledged & result.deletedCount!==0) {
            const response = { status: "Success", payload: `El usuario fue eliminado con Exito!`};       
            //muestro resultado
            res.status(200).send(response);
            
        // } else {
        //     req.logger.error(`deleteUser = No se pudo eliminar el user`);
        //     //muestro resultado error
        //     res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo eliminar el usuario, verifique los datos ingresados"});
        // };   
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
};

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    passLink,
    linkPass,
    putPass,
    gitUser, 
    gitCallbackUser, 
    currentUser,
    changeRol,
    deleteUser,
    insertFile, 
    getUsersAll,
    deleteAllUser
}