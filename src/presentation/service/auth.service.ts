import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserModel } from "../../data/mongo/model/user.model";
import { CustomError } from "../../domain/errors/custom.error";
import { UserEntity } from "../../domain/entities/user.entity";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { JwtAdapter } from "../../config/jwt.adapter";
import { EmailService } from "./email.service";
import { envs } from "../../config/envs";

export class AuthService {

    //DI
    constructor(
        private readonly emailService: EmailService,
    ){}

    public async registerUser(registerUserDto: RegisterUserDto){

        const existUser = await UserModel.findOne({
            email: registerUserDto.email
        });
        
        if(existUser) throw CustomError.badRequest('Email already registered');

        try {
            const user = new UserModel(registerUserDto);

            //Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);

            //JWT para mantener la auntenticacion del usuario
            //Generacion del token y captura del error.
            const token = await JwtAdapter.generateToken({id: user.id});
            if(!token) throw CustomError.internalServer('Error while creating jwt.');

            //Guardamos usuario en la BD
            await user.save();

            //Email de confirmacion
            await this.sendEmailConfirmation(user.email);

            const {password, ...userEntity} = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: token
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    public async loginUser(loginUserDto: LoginUserDto){
        try {
            const existUser = await UserModel.findOne({
                email: loginUserDto.email
            });
            
            if(!existUser) throw CustomError.badRequest('Email does not exist');
            
            const isEqual = bcryptAdapter.compare(loginUserDto.password, existUser.password);

            if(!isEqual) throw CustomError.badRequest('Incorrect password');

            const {password, ...userEntity} = UserEntity.fromObject(existUser);

            const token = await JwtAdapter.generateToken({id: existUser.id});

            if(!token) throw CustomError.internalServer('Error while creating jwt.');

            return {
                user: userEntity,
                token: token
            };
           

        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }

    }

    public async validateEmail(token: string) {
        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid token');

        const {email} = payload as {email: string};
        if(!email) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({email: email});
        if(!user) throw CustomError.internalServer('Email not exist');

        user.emailValidated = true;
        await user.save();
        
        return true;

    }

    private async sendEmailConfirmation(email: string) {
        const token = await JwtAdapter.generateToken({email}, "15m");
        if(!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${link}">Validate your email: ${email}</a>
        `

        const options = {
            to: email,
            subject: 'Valida tu email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail(options);

        if(!isSent) throw CustomError.internalServer('Error sending email');

        return true;


    }

}