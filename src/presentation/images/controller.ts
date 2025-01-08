import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { FileUploadService } from "../service/file-upload.service";
import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from 'fs';

export class ImagesController {

    // DI
    constructor(
        
    ){}

    private handleError = (res: Response, error: unknown) => {
        if(error instanceof CustomError) {
            res.status(error.statusCode).json({error: error.message});
            return;
        }

        const serverError = CustomError.internalServer('Internal server error - check logs');
        res.status(serverError.statusCode).json({error: serverError.message});
        return;
    }
    
    public getImage = (req: Request, res: Response) => {
        
        const {type = '', img = ''} = req.params;

        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`)
        console.log(__dirname);
        console.log(imagePath);
        if(!fs.existsSync(imagePath)) {
            this.handleError(res, CustomError.notFound('Image not found'))
            return;
        }

        res.sendFile(imagePath);


    } 

}