import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { FileUploadService } from "../service/file-upload.service";
import { UploadedFile } from "express-fileupload";


export class FileUploadController {

    // DI
    constructor(
        private readonly fileUploadService: FileUploadService
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
    
    public uploadFile = async(req: Request, res: Response) => {
        
        const type = req.params.type;
        const file = req.body.files[0] as UploadedFile;

        this.fileUploadService.uploadSingleFile(file, `uploads/${type}`)
            .then( uploaded => res.json(uploaded))
            .catch(error => this.handleError(res, error));

    } 

    public uploadMultipleFile = async(req: Request, res: Response) => {

        const type = req.params.type;
        const files = req.body.files as UploadedFile[];
        
        this.fileUploadService.uploadMultipleFile(files, `uploads/${type}`)
            .then( uploaded => res.json(uploaded))
            .catch(error => this.handleError(res, error));

    }
}