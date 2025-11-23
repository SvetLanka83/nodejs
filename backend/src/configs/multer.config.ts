import path from "node:path";

import multer from "multer";
import { v6 } from "uuid";

import { StatusCodesEnum } from "../enums/status-codes-enum";
import { ApiError } from "../errors/api.error";

const storage = multer.diskStorage({
    destination: (req, file, cb): void => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb): void => {
        const uniqueSuffix = v6();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}.${ext}`);
    },
});
const fileFilter = (req, file, cb): void => {
    const allowedTypes = /.jpeg|.jpg|.png|.gif/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase(),
    );
    const minetype = allowedTypes.test(file.minetype);

    if (extname && minetype) {
        return cb(null, true);
    } else
        cb(
            new ApiError(
                "Onli images are allowed",
                StatusCodesEnum.BED_REQUEST,
            ),
        );
};
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter,
});
export { upload };
