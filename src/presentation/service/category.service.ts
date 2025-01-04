import mongoose from "mongoose";
import { CategoryModel } from "../../data/mongo/model/category.model";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";

export class CategoryService {

    //DI
    constructor(){}

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity){

        const category = await CategoryModel.findOne({name: CreateCategoryDto.name});
        console.log('user: ' + user.name);
        if(category) throw CustomError.badRequest('Category already exists');

        try {
            
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id,
            })

            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }

        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Internal server error');
        }

    } 

    async getCategories(paginationDto: PaginationDto){

        const {page, limit} = paginationDto;
        const offset = (page - 1) * limit;
        try {
            // const total = await CategoryModel.countDocuments();
            // const result = await CategoryModel.find().skip(offset).limit(limit)
            
            const [total, result] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find().skip(offset).limit(limit)
            ])

            const limitPage = total / limit;
            
            const categories = result.map(CategoryEntity.fromObject);

            return {
                categories,
                page,
                limit,
                total,
                next: (page < limitPage) ? `/api/categories?page=${page + 1}&limit=${limit}` : null,
                prev: (page > 1 && page <= limitPage + 1) ? `/api/categories?page=${page - 1}&limit=${limit}` : null,
            };
        
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Internal server error');
        }




    }

}