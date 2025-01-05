import { Validators } from "../../../config/validators";


export class CreateProductDto {

    private constructor(
        private readonly name: string,
        private readonly available: boolean,
        private readonly price: number,
        private readonly description: string,
        private readonly user: string, // ID
        private readonly category: string, // ID
    ){}

    static create(object: {[key: string]: any}): [string?, CreateProductDto?] {

        const {name, available = false, price, description, user, category} = object;
        let availableBool = available;

        if(!name) return ['Missing name'];
        if(!user) return ['Missing user'];
        if(!Validators.isMongoId(user)) return ['Invalid user id'];
        if(!category) return ['Missing category'];
        if(!Validators.isMongoId(category)) return ['Invalid category id'];
        if( typeof available !== 'boolean'){
            availableBool = (available === 'true');
        }

        return [undefined, new CreateProductDto(name, availableBool, price, description, user, category)]
    }

}