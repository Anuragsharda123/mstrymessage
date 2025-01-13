import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';
// import { usernameValidation } from "@/schemas/signUpSchema";

const  usernameValidation = z
.string()
.min(2, "Username must be atleast 2 characters")
.max(20, "Username must be atmost 20 characters")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export const GET = async(req:Request) => {
    await dbConnect();
    try{
        const { searchParams } = new URL(req.url);
        const queryParam = {
            username: searchParams.get('username')
        };
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log("result Error---->", result)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            console.log("11111");
            return Response.json({success:false, message: usernameErrors.length>0 ? usernameErrors.join(', ') : "Invalid Query Parameter"}, {status:400});
        }
        const username = result.data?.username;
        const existingVerifiedUser = await UserModel.findOne({username, isVerified:true});
        if (existingVerifiedUser) {
            return Response.json({success:false, message: "Username is already taken"}, {status:400});
        }
        
        return Response.json({success:true, message: "Username is available"}, {status:200});
        
    }
    catch(err){
        console.log("Error checking username", err);
        return Response.json({success:false, message:"Error checking username"})
    }
}