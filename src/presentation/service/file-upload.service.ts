import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from 'fs';
import { Uuid } from "../../config/uuid.adapter";
import { CustomError } from "../../domain/errors/custom.error";

export class FileUploadService {

    //DI
    constructor(
        private readonly uuid = Uuid.v4
    ){}

    private checkFolder(folderPath: string) {
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }
    }

    async uploadSingleFile(
        file: UploadedFile, 
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
    ){
        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? ''; //file.mimetype.split('/').at(1) || '';

            if(!validExtensions.includes(fileExtension)) {
                throw CustomError.badRequest(`Invalid file extension: ${fileExtension}, valid ones ${validExtensions}`);
            }

            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolder(destination);
            
            const fileName = `${this.uuid()}.${fileExtension}`;

            file.mv(destination + '/' + fileName);

            return {fileName};

        } catch (error) {
            console.log(error);
            if(error instanceof CustomError) throw error;
            else {
                throw CustomError.internalServer('Internal server error');
            }
            
        }

    } 

    async uploadMultipleFile(
        files: UploadedFile[], 
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
    ){
        
        const fileNames = await Promise.all(
            files.map( file => this.uploadSingleFile(file,folder, validExtensions ))
        );

        return fileNames;

    }

}