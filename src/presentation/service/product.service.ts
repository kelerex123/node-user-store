import { PaginationDto } from './../../domain/dtos/shared/pagination.dto';
import { ProductModel } from "../../data/mongo/model/product.model";
import { CreateProductDto } from "../../domain/dtos/product/create-product.dto";
import { CustomError } from "../../domain/errors/custom.error";

export class ProductService {

    constructor() { }

    async createProduct(createProductDto: CreateProductDto) {
        const product = await ProductModel.findOne({ name: CreateProductDto.name });

        if (product) throw CustomError.badRequest('Product already exists');

        try {

            const product = new ProductModel({
                ...createProductDto,
            })

            await product.save();

            return product;

        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Internal server error');
        }
    }

    async getProducts(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const offset = (page - 1) * limit;
        try {

            const [total, result] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find().skip(offset).limit(limit).populate('user').populate('category'),
            ])

            const limitPage = total / limit;

            

            return {
                products: result,
                page,
                limit,
                total,
                next: (page < limitPage) ? `/api/products?page=${page + 1}&limit=${limit}` : null,
                prev: (page > 1 && page <= limitPage + 1) ? `/api/products?page=${page - 1}&limit=${limit}` : null,
            };

        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Internal server error');
        }
    }


}