import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../service/file-upload.service";
import { Uuid } from "../../config/uuid.adapter";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";




export class FileUploadRoutes{

    constructor(){}

    static get routes(): Router{

        const router = Router();
        const fileUploadService = new FileUploadService();
        const controller = new FileUploadController(fileUploadService);

        router.use([FileUploadMiddleware.containFiles, FileUploadMiddleware.validTypes(['users', 'categories','products'])]);
        router.post('/single/:type', controller.uploadFile);
        router.post('/multiple/:type', controller.uploadMultipleFile);

        return router;

    }

}