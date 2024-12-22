import { regularExps } from "../../../config/regular-exp";


export class LoginUserDto {

    constructor(
        public email: string,
        public password: string,
    ){}

    static create(object: {[key: string]: any}): [string?, LoginUserDto?] {

        const {email, password} = object;

        if(!email) return ["Email is required"];
        if(!regularExps.email.test(email)) return ['Email is not valid'];
        if(!password) return ["Password is required"];
        if(password.length < 6) return ['Password is too short'];
        if(typeof password !== 'string') return ['Password must be a string'];


        return [undefined, new LoginUserDto(email, password)];

    }


}