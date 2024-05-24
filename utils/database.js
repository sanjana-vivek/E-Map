import mongoose from "mongoose";
//track connection status
let isConnected = false;

export const connectToDb = async() => {
    mongoose.set('strictQuery', true);

    if (isConnected){
        console.log("MongoDB is already connected");
        return;
    }
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName: "geospatial_files"
        })
        isConnected = true;
        console.log("MongoDB is connected");
    } catch(error){
        console.log("Error in connection: ", error);
    }
}