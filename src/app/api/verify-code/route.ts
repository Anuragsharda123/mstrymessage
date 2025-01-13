import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const POST = async(req:Request) => {
    await dbConnect();
    try{
        const {username, code} = await req.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername});
        
        if(!user){
            return Response.json({success:false, message:"User not found"},{status:500});
        };
        
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        
        if (isCodeNotExpired && isCodeValid) {
            user.isVerified = true;
            await user.save();
            return Response.json({success:true, message:"Account Verified Successfully"},{status:200});
        } else if(!isCodeNotExpired) {
            return Response.json({success:true, message:"Verification Code has Expired, please signup again"},{status:400});
        } else {
            return Response.json({success:true, message:"Incorrect Verification Code"},{status:400});

        }
    }
    catch(err){
        console.log(err);
    }
}