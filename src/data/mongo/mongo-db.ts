import mongoose from "mongoose";

interface Options {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {

    static async connect(options: Options) {
        // Connect to MongoDB
        const {mongoUrl, dbName} = options;

        
        try {
            await mongoose.connect(mongoUrl, {dbName: dbName});
            return true;
            
        } catch (error) {
            console.log('Mongo connection error')
            throw error;
        }

    }

    static async disconnect() {
        
        try {
            await mongoose.disconnect();
            return true;
            
        } catch (error) {
            console.log('Mongo disconnection error')
            throw error;
        }

    }

}