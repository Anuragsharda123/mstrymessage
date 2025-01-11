import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export const POST = async(req:Request, res:any) => {
    await dbConnect();
    try{
        const {username, email, password} = await req.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if (existingUserVerifiedByUsername) {
            return res.status(400).json({success:false, message:"Username already exists."});
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(1000+Math.random()*900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return res.status(500).json({success:false, message:"user already exist"})
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

            const newUser = await new UserModel({
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


        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (emailResponse.success) {
            return res.status(500).json({success:false, message:emailResponse.message})
        }
        return res.status(201).json({success:true, message:"User registered successfully, please verify your email"});
    }
    catch(err){
        console.log("Error registering user", err);
        return res.status(500).json({ success:false, message: "Error registering user"});
    }
}