import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryService } from "../service/category.service";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";


export class CategoryController {

    // DI
    constructor(
        private readonly categoryService: CategoryService
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
    
    public createCategory = async(req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
        if(error) {
            this.handleError(res, CustomError.badRequest(error));
            return;
        };

        this.categoryService.createCategory(createCategoryDto!, req.body.user)
            .then((category) => res.json(category))
            .catch((error) => this.handleError(res, error));
            

    } 

    public getCategories = async(req: Request, res: Response) => {

        
        const {page = 1, limit = 10} = req.query;
       
        const [error, paginationDto] = PaginationDto.create(+page, +limit);

        if(error) {
            this.handleError(res, CustomError.badRequest(error));
            return;
        }


        this.categoryService.getCategories(paginationDto!)
            .then((categories) => res.json(categories)) 
            .catch((error) => this.handleError(res, error));

    } 
}