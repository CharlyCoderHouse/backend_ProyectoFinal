import { getAllUser as getAllUserService,
    getUser as getUserService, 
    getUserById as getUserByIdService,
    addUser as addUserService, 
    updateUser as updateUserService, 
    updatePushUser as updatePushUserService,
    deleteUserById as deleteUserByIdService,
    deleteAllUser as deleteAllUserService } from '../services/user.service.js';
import { responseMessages } from '../helpers/proyect.helpers.js';
import { generateToken, generateTokenResetPass, createHash, isValidPassword } from '../utils/utils.js';
import { PRIVATE_COOKIE } from '../helpers/proyect.constants.js';
import UsersDto from '../dao/DTOs/users.dto.js';
import { deleteCartById, postCart } from '../services/carts.service.js';
import { loginNotification } from '../utils/custom-html.js';
import { sendEmail } from "../services/mail.js";
import moment from "moment";
import { deleteNotification } from '../utils/custom-html-delete.js';
import config from '../config/config.js';

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
            role: "User",
            cartId: user.cart._id
        }
        
        if(user.email === 'adminCoder@coder.com') {
            //&& password === 'adminCod3r123'
            req.user.role = "Admin";
        }

        const accessToken = generateToken(user);

        // Guardo la ultima conexión
        const userId = String(user._id)
        const newLastConnect =  new Date();
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
    const newLastConnect =  new Date();
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
        role: "User", 
    };

    if(req.user.email === 'adminCoder@coder.com' ) {
        req.user.role = "Admin";
    }
    const accessToken = generateToken(req.user);
    
    // Guardo la ultima conexión
    const userId = String(user._id)
    const newLastConnect =  new Date();
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

        const link = `http://${config.url_base}/api/sessions/linkPassword?token=${accessToken}`
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

const insertFile = async (req, res) => {

    const id = String(req.params.uid); 
    const user = await getUserByIdService(id);
    
    const newDocument = [];
    let flagID = false;
    
    if (!req.files) {
        return res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el usuario, porque no hay archivos"});
    }
    
    if (req.files.products) {
        return res.status(200).json({ status: "Success", data: "Se almaceno la imagen del producto correctamente"});
    }

    try {

        if (req.files.profiles) {

            req.files.profiles.forEach(element => {    
                const filename = element.filename;
                const name = element.fieldname
                const obj1 = {
                    name: name,
                    reference: `http://${config.url_base}/data/${name}/${filename}`
                }
                newDocument.push(obj1)
            });
        };

        if (req.files.IDENTIFICATION) {
            
            req.files.IDENTIFICATION.forEach((element) => {
                const filename = element.filename;
                const name = element.fieldname;

                user.status.forEach((element)=> {
                    if (element === "IDENTIFICATION"){
                        flagID=true;
                    }
                })
                //Update de Status en el cliente
                flagID ? flagID = false : updatePushUserService(id, {status: name});
    
                const obj2 = {
                    name: name,
                    reference: `http://${config.url_base}/data/documents/${filename}`
                }
                newDocument.push(obj2)
            });
        }

        if (req.files.ADDRESS) {
            
            req.files.ADDRESS.forEach((element) => {
                const filename = element.filename;
                const name = element.fieldname;

                user.status.forEach((element)=> {
                    if (element === "ADDRESS"){
                        flagID=true;
                    }
                })
                //Update de Status en el cliente
                flagID ? flagID = false : updatePushUserService(id, {status: name});                
    
                const obj2 = {
                    name: name,
                    reference: `http://${config.url_base}/data/documents/${filename}`
                }
                newDocument.push(obj2)
            });
        }

        if (req.files.ACCOUNT) {
            
            req.files.ACCOUNT.forEach((element) => {
                const filename = element.filename;
                const name = element.fieldname;

                user.status.forEach((element)=> {
                    if (element === "ACCOUNT"){
                        flagID=true;
                    }
                })
                //Update de Status en el cliente
                flagID ? flagID = false : updatePushUserService(id, {status: name});  
    
                const obj2 = {
                    name: name,
                    reference: `http://${config.url_base}/data/documents/${filename}`
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
        
    } catch (error) {
        req.logger.error(`insertFile = No se pudieron insertar los documentos!`);
        const response = { status: "NOT FOUND", payload: 'No se pudieron insertar los documentos', error };
        res.status(500).send(response);
    }
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

const deleteUser = async (req, res) => {
    try {
        // Leo el Id del usuario por parámetro y el carrito que le corresponde
        const id = String(req.params.uid);
        const { motivo } = req.body;
    
        const user = await getUserByIdService(id);
        
        if(user) {
            const cartId = user.cart;
            //Elimino el carrito asociado al usuario
            await deleteCartById(cartId);

            //Una vez elimando el carrito, intento eliminar el usuario
            const result = await deleteUserByIdService(id);
            
            // Envío mail de aviso
            const type = "Usuario"
            const detail = `usuario con mail ${user.email}`
            const reason = `${motivo}`
            const mail = { 
                to: user.email,
                subject: 'Eliminación de Usuario',
                html: deleteNotification(type,detail,reason)
            }
            
            await sendEmail(mail); 
            
            //Valido que se realizo el DELETE
            if (result.acknowledged & result.deletedCount!==0) {
                const response = { status: "Success", payload: `El usuario fue eliminado con Exito!`};       
                //muestro resultado
                res.status(200).json(response);
            } else {
                req.logger.error(`deleteUser = No se pudo eliminar el user`);
                //muestro resultado error
                res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo eliminar el usuario, verifique los datos ingresados"});
            };   
        } else {
            req.logger.error(`deleteUser = No existe el usuario a eliminar.`);
            res.status(404).json({ status: "NOT FOUND", data: "No existe el usuario a eliminar!"});
        };
        
    } catch (error) {
        res.status(500).send({ status: "Error", data: `No se pudo eliminar el usuario` , error });
    }
};

const deleteAllUser = async (req, res) => {
    try {
        const { day } = req.body;
        const condition = moment().subtract(day, 'days');
        // Condicion para no eliminar users Admin
        const conditionAdmin = { role: { $ne: "Admin" }}
        // busco los usuarios que coinciden para eliminar sus carros
        const usersAll = await getAllUserService({$and: [{ last_connection: {$lt: condition} }, conditionAdmin]});

        if (usersAll.length > 0){

            //Elimino los carritos asociados a los usuarios a eliminar
            usersAll.forEach(async (element) => {
                //Elimino el carrito asociado al usuario
                await deleteCartById(element.cart);
                // Envío mail de aviso
                const type = "Usuario"
                const detail = `usuario con mail ${element.email}`
                const reason = "Por inactividad de la cuenta"
                const mail = { 
                    to: element.email,
                    subject: 'Eliminación de Usuario',
                    html: deleteNotification(type,detail,reason)
                }
                
                await sendEmail(mail); 
            })

            const usersDelete = await deleteAllUserService({$and: [{ last_connection: {$lt: condition} }, conditionAdmin]});
            
            //Valido que se realizo el UPDATE
            if (usersDelete.acknowledged & usersDelete.deletedCount!==0) {
                const response = { status: "Success", payload: `Se eliminaron ${usersDelete.deletedCount} usuarios!`};       
                //muestro resultado
                res.status(200).send(response);
                
            } else {
                req.logger.error(`deleteAllUser = No se pudo eliminar el user`);
                //muestro resultado error
                res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo eliminar el usuario, verifique los datos ingresados"});
            };   
        } else {
            req.logger.error(`deleteAllUser = No hay usuarios a eliminar`);
            //muestro resultado error
            res.status(403).json({ status: "NOT FOUND", data: "No hay usuarios para eliminar"});
        };   
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