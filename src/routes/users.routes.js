import { Router } from 'express';
import userController from '../dao/controllers/user.controller.js';
import { updateRole} from '../dao/controllers/user.controller.js';
import CustomError from "../services/error.custom.class.js";
import errorsDictionary from "../services/error.dictionary.js";
import authToken from '../auth/custom.jwt.auth.js';
import handlePolicies from '../auth/policies.auth.js';
import { catcher } from '../utils.js';

const router = Router()
const controller = new userController()

router.get("/", authToken, handlePolicies(['admin']), catcher(async (req, res) => {
    req.logger.warn('Este contenido debería estar en archivo');
    res.status(200).send({ status: "OK", data: await controller.getUsers() });
}));

router.get("/paginated", authToken, handlePolicies(['admin']), catcher(async (req, res) => {
    res.status(200).send({ status: "OK", data: await controller.getUsersPaginated(req.query.page || 1, req.query.limit || 50) });
}));

router.put('/premium/:uid', updateRole);

router.post("/", authToken, handlePolicies(['admin']), catcher(async (req, res) => {
    const { first_name, last_name, email, gender, password } = req.body;
    
    if (first_name && last_name && email && gender && password) {
        return res.status(200).send({ status: "OK", data: await controller.addUser(req.body) });
    }

    throw new CustomError({...errorsDictionary.FEW_PARAMETERS, moreInfo: 'first_name, last_name, email, gender, password'});
}));

router.post("/:uid/documents", multerArchivos, usersControllers.subirArchivos);

export default router;