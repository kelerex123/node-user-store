import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../service/category.service";




export class CategoryRoutes {

    constructor(){}

    static get routes(): Router{

        const router = Router();
        const categoryService = new CategoryService();
        const controller = new CategoryController(categoryService);

        router.get('/', controller.getCategories);
        router.post('/', [AuthMiddleware.validateJWT], controller.createCategory);

        return router;

    }

}