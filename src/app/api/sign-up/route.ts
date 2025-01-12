import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import sendOTP from "@/helpers/sendVerificationEmail";

export const POST = async(req:Request, res:any) => {
    await dbConnect();
    try{
        const {username, email, password} = await req.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({success:false, message:"Username already exists."}, {status:400});
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(1000+Math.random()*900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({success:false, message:"user already exist"}, {status:500})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }


        sendOTP(email, username, verifyCode);
        console.log("\n\nOTP", verifyCode);

        return Response.json({success:true, message:"User registered successfully, please verify your email"}, {status:201});
    }
    catch(err){
        console.log("Error registering user", err);
        return Response.json({ success:false, message: "Error registering user"}, {status:500});
    }
}