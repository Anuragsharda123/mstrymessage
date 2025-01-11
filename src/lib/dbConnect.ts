import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
};

const connection:ConnectionObject = {}

const dbConnect = async():Promise<void> => {
    if(connection.isConnected){
        console.log("Already Connected");
        return;
    }

    try{
        const db = await mongoose.connect("mongodb+srv://anuragsharda131:Hello123@mystrymsg.ejz0r.mongodb.net/");
        connection.isConnected = db.connections[0].readyState;
        console.log("Database Connected");
    }
    catch(err){
        console.log("Database connection failed", err);
        process.exit(1);
    }
}

export default dbConnect;