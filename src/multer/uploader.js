import multer from 'multer'
import { __dirname} from '../utils.js'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img`)
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const multerArchivos = uploader.fields([
    {name:'imagenPerfil', maxCount: 1},
    {name:'imagenProducto', maxCount: 1},
    {name:'documents', maxCount:3}
])

export const uploader = multer({ storage })
module.exports = multerArchivos