import { CustomError } from "../errors/custom.error";


export class CategoryEntity {

    constructor(
        public id: string,
        public available: boolean,
        public name: string,
    ){}

    static fromObject(object: {[key:string]: any}) {

        const {id, _id, name, available = false} = object;

        if(!id && !_id) {
            throw CustomError.internalServer('Missing id');
        }

        if(!name) throw CustomError.internalServer('Missing name'); 
        if(typeof available !== 'boolean') throw CustomError.internalServer('Available must be boolean');
       

        return new CategoryEntity(_id || id, available, name);

    }

}