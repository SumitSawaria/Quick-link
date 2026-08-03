// isme mongodb ka configeration file hoga

import mongoose from "mongoose";    //Mongoose is a package that helps Node.js talk to MongoDB easily.
//console.log(process.env.MONGO_URI);
const connectDB = async () =>{    // Connecting to a database takes time.Node shouldn't stop everything while waiting So we use:asynchronous func

    try{
        await mongoose.connect(process.env.MONGO_URI);

console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    }catch (error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;