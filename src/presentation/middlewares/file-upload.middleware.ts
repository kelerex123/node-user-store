import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";




export class FileUploadMiddleware {

    constructor() { }

    private static handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }

        const serverError = CustomError.internalServer('Internal server error - check logs');
        res.status(serverError.statusCode).json({ error: serverError.message });
        return;
    }
    
    static async containFiles(req: Request, res: Response, next: NextFunction) {
        const files = req.files;

        if(!files || Object.keys(files).length === 0){
            FileUploadMiddleware.handleError(res, CustomError.badRequest('No files were selected'));
            return
        }

        if(!files.file){
            FileUploadMiddleware.handleError(res, CustomError.badRequest('File must be uploaded in field "file"'));
            return
        }

        if(!Array.isArray(files.file)){
            req.body.files = [files!.file];
        }else {
            req.body.files = files.file;
        }

        next();

    }

    static validTypes(validTypes: string[]) {
        return async function(req: Request, res: Response, next: NextFunction) {

            //const type = req.params.type ?? '';   
            const type = req.url.split('/')[2] ?? '';   

            if(!validTypes.includes(type)){
                FileUploadMiddleware.handleError(res, CustomError.badRequest(`Invalid type: ${type}, valid ones ${validTypes}`));
                return;
            }
    
            next();
    
        }
    }

   

}