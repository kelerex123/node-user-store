import { CustomError } from "../errors/custom.error";


export class UserEntity {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public role: string[],
        public img?: string,
    ){}

    static fromObject(object: {[key:string]: any}) {

        const {id, _id, name, email, emailValidated, password, role, img} = object;

        if(!id && !_id) {
            throw CustomError.internalServer('Missing id');
        }

        if(!name) throw CustomError.internalServer('Missing name'); 
        if(!email) throw CustomError.internalServer('Missing email');
        if(emailValidated == undefined) throw CustomError.internalServer('Missing emailValidated');
        if(!password) throw CustomError.internalServer('Missing password');
        if(!role) throw CustomError.internalServer('Missing role');

        return new UserEntity(_id || id, name, email, emailValidated, password, role, img);

    }

}