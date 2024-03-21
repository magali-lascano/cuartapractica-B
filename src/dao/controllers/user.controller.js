import { userModel } from "../models/userModel.js"
import { UserService } from "../../services/users.services.js"


class UserMongo {
    
    async login(email, password){
        try {
            if(email==="" || password === ""){
                throw new Error(`All fields are required`);
            }
            
            const userFound = await User.findOne({email, password});
            if(!userFound){
                throw new Error(`User ${email} Not Found!`);
            }

            return userFound;
        } catch (error) {
            throw new Error(error);
        }
    }

    async register(name, email, password){
        try {
            if(name==="" || email==="" || password === ""){
                throw new Error(`All fields are required`);
            }
            
            const existsUser = await User.findOne({email});
            if(existsUser){
                throw new Error(`User ${email} duplicate!`);
            }

            const data = {
                name, 
                email, 
                password
            }
            const user = new User(data);
            await user.save();
        } catch (error) {
            throw new Error(error);
        }   
    }
}

// Actualiza última conexión
const lastConnection = async (req, res) => {
    req.session.user.last_connection = new Date()
    await usersServices.updateUser(req.session.user._id, req.session.user)
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/api/sessions')
        } else {
            res.send("Error al intentar salir.")
        }
    })
}

const userService = new UserService();

// Cargar archivos
const subirArchivos = async (req, res) => {
    try {
        let {uid} = req.params
        let user = await usersServices.getUserById(uid)
        if (!user) return res.send({ message: "Usuario no registrado" })
        if (!req.files) return res.send({ message: "Archivos no encontrados."})

        user.documents.push({
            name: req.files['imagenPerfil'][0].originalname,
            reference: req.files['imagenPerfil'][0].path,
            status: "Ok"
        }, {
            name: req.files['imagenProducto'][0].originalname,
            reference: req.files['imagenProducto'][0].path,
            status: "Ok"
        })
        for (let i = 0; i < req.files['documents'].length; i ++) {
            let document = {
                name: req.files['documents'][i].originalname,
                reference: req.files['documents'][i].path,
                status: "Ok"
            }
            user.documents.push(document)
        }
        await usersServices.updateUser(uid, user)
        res.status(200).json({message:"Archivos cargados correctamente."})   
        } catch (error) {
        res.status(400).json({message: "Error al cargar los archivos"})   
    }
}

// Actualizar Rol
export const updateRole = async (req , res) => {
    const idUser = req.params.uid;
    try {
        let {uid} = req.params
        let user = await usersServices.getUserById(uid)
        if (!user) return res.send({ message: "Usuario no registrado" })
        if (user.role === "user") {
            if (user.documents.length === 5) {
            user.role = "premium"
            } else{
        return res.status(400).json({message: "No ha terminado de procesar su documentación."})
        }
    } else {
        user.role = "user"
    } 
    await usersServices.updateUser(user._id, user)

    res.status(200).json({message: "Usuario Premium"})

    } catch (error) {
    res.status(400).json({message: "Error al actualizar plan premium"})
    }
}

export default UserMongo;
module.exports = {
    updateRole,
    subirArchivos,
    lastConnection
}