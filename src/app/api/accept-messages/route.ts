import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export const POST = async(req:Request) => {
    await dbConnect();
    try{
        const session = await getServerSession(authOptions);
        const user = session?.user as User;
        if(!session || !session.user ){
            return Response.json({success:false, message: 'Not Authenticated'}, {status: 401});
        }
        
        const userId = user.id;
        const {acceptMessages} = await req.json()
        
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage: acceptMessages}, {new:true})
        if(!updatedUser){
            return Response.json({success:false, message: 'Falied to update user'}, {status: 401});
        } else {
            return Response.json({success:true, message: 'Status Updated Successfully'}, {status: 200});
        }
    }

    catch(err){
        return Response.json({success:false, message: 'Falied to update user'}, {status: 500});
    }
}

export const GET = async (req:Request) => {
    await dbConnect();
    try{
        const session = await getServerSession(authOptions);
        const user = session?.user as User;
        if(!session || !session.user ){
            return Response.json({success:false, message: 'Not Authenticated'}, {status: 401});
        }
        
        const userId = user.id;
        const foundUser = await UserModel.findById(userId);
        
        if(!foundUser){
            return Response.json({success:false, message: 'User not found'}, {status: 404});
        } else{
            return Response.json({success:true, message: 'User found', foundUser}, {status: 200});
        }
    }
    catch(err){
        return Response.json({success:false, message: 'Something went wrong'}, {status: 500});
    }
}