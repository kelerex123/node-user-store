import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data/mongo/model/user.model";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthMiddleware {

    static async validateJWT(req: Request, res: Response, next: NextFunction){

        const authorization = req.header('Authorization');
        if(!authorization) {
            res.status(401).json({error: 'No token provided'});
            return; 
        }
            
        if(!authorization.startsWith('Bearer ')) {
            res.status(401).json({error: 'Invalid Bearer token'});
            return; 
        }

        const token = authorization.split(' ').at(1) || '';

        try {
            
            const payload = await JwtAdapter.validateToken<{id: string}>(token);
            if(!payload) {
                res.status(401).json({error: 'Invalid token'});
                return; 
            }

            const user = await UserModel.findById(payload.id); //Usar un service o patron repository

            if(!user){
                res.status(401).json({error: 'Invalid token - user'});
                return;
            } 

            //TODO: Validar si el usuario esta activo

            req.body.user = UserEntity.fromObject(user);
            
            next();

 
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Internal server error'});
        }

    }

}