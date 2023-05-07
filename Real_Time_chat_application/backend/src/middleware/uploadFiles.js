import multer from "multer";
import path from "path";

let limit = {
    fileSize: 1024 * 1024 * 2, //2Mb
};

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let staticFolder = req.query.staticFolder || "backend/public";
        cb(null, staticFolder);
    },

    filename: (req, file, cb) => {
        let fileName = Date.now() + file.originalname;
        cb(null, fileName);
    },
});

let fileFilter = (req, file, cb) => {
    let validExtensions = req.query.validExtensions
        ? req.query.validExtensions.split(",")
        : [
            ".jpeg",
            ".jpg",
            ".JPG",
            ".JPEG",
            ".png",
            ".svg",
            ".doc",
            ".pdf",
            ".mp4",
        ];

    let originalName = file.originalname;
    let originalExtension = path.extname(originalName);
    let isValidExtension = validExtensions.includes(originalExtension);

    if (isValidExtension) {
        cb(null, true);
    } else {
        cb(new Error("File is not supported"), false);
    }
};

const upload = multer({
    storage: storage, //we define the location in server where the file is store and control the fileName
    fileFilter: fileFilter, //we filter (generally) according to file
    limit: limit, //we filter file according to its size
});

export default upload;
