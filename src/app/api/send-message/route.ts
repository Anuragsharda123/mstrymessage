import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export const POST = async(req:Request) => {
    await dbConnect();
    const {username, content} = await req.json()
    try{
        const user = await UserModel.findOne({username});
        if (!user) {
            return Response.json({success:false, message: 'User not Found'}, {status: 404});
        }

        if (!user.isAcceptingMessage) {
            return Response.json({success:false, message: 'User is not accepting messages '}, {status: 403});
        }

        const newmessage = {content, createdAt:new Date};
        user.messages.push(newmessage as Message); 
    }
    catch(err){

    }
}