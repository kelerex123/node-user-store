import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { AuthService } from "../service/auth.service";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";



export class AuthController {

    //DI
    constructor(
        private readonly authService: AuthService
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

    public registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        
        if(error) {
            this.handleError(res, CustomError.badRequest(error));
            return;
        }
        
        this.authService.registerUser(registerDto!)
            .then( (user) => res.json(user))
            .catch( (err) => this.handleError(res, err));
        
    }

    public loginUser = (req: Request, res: Response) => {
        const [error, loginDto] = LoginUserDto.create(req.body);

        if(error) {
            this.handleError(res, CustomError.badRequest(error));
            return;
        }

        this.authService.loginUser(loginDto!)
            .then( (user) => res.json(user))
            .catch( (err) => this.handleError(res, err));
    }

    public validateEmail = (req: Request, res: Response) => {
        const {token} = req.params;

        this.authService.validateEmail(token)
           .then( () => res.json('Email was validated'))
           .catch( (err) => this.handleError(res, err));

    }

}