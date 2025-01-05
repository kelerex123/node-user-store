import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryService } from "../service/category.service";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { ProductService } from "../service/product.service";
import { CreateProductDto } from "../../domain/dtos/product/create-product.dto";


export class ProductController {

    // DI
    constructor(
        private readonly productService: ProductService
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
    
    public createProduct = async(req: Request, res: Response) => {
        const [error, createProductDto] = CreateProductDto.create({
            ...req.body,
            user: req.body.user.id
        });
        if(error) {
            this.handleError(res, CustomError.badRequest(error));
            return;
        };

        this.productService.createProduct(createProductDto!)
            .then((product) => res.json(product))
            .catch((error) => this.handleError(res, error));
            

    } 

    public getProducts = async(req: Request, res: Response) => {

        
        const {page = 1, limit = 10} = req.query;
       
        const [error, paginationDto] = PaginationDto.create(+page, +limit);

        if(error) {
            this.handleError(res, CustomError.badRequest(error));
            return;
        }


        this.productService.getProducts(paginationDto!)
            .then((products) => res.json(products)) 
            .catch((error) => this.handleError(res, error));

    } 

}