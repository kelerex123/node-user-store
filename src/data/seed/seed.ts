import { envs } from "../../config/envs";
import { CategoryModel } from "../mongo/model/category.model";
import { ProductModel } from "../mongo/model/product.model";
import { UserModel } from "../mongo/model/user.model";
import { MongoDatabase } from "../mongo/mongo-db";
import { seedData } from "./data";


(async () => {

    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    await main();

    await MongoDatabase.disconnect();

})();

const randomBetweenNumbers = (n: number) => {
    return Math.floor(Math.random() * n);
}

async function main () {

    // 0. Borrar todo

    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ]);

    // 1. Crear usuarios
    const users = await UserModel.insertMany(seedData.users);


    // 2. Crear categorias

    const categories = await CategoryModel.insertMany(
        seedData.categories.map( category => {
            return {
                ...category,
                user: users[0]._id
            }
        })
    );

    // 3. Crear productos
    const products = await ProductModel.insertMany(
        seedData.products.map( product => {
            return {
                ...product,
                user: users[randomBetweenNumbers(seedData.users.length - 1)]._id,
                category: categories[randomBetweenNumbers(seedData.categories.length - 1)]._id
            }
        })
    );

    console.log("SEEDED");
}