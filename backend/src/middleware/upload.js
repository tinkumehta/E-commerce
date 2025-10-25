import multer from 'multer'
import path from 'path'
import {fileURLToPath} from 'url'


const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// check file type

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else{
        cb(new Error('Only images are allowed!'));
    }
}

// initialize upload
const upload = multer({
    storage: storage,
    limits : {fileSize : 5 * 1024 * 1024}, // 5 mb limt
    fileFilter: function (req, file, cd){
        checkFileType(file, cb);
    }
});

export default upload;