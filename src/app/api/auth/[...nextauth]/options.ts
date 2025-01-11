import { NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';


export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: {label:"Email", type:"text", placeholder: "Enter username"},
                password: {label:"password", type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try{
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    });

                    if (!user) {
                        throw new Error("User doesn't exist");
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account first");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user; // user is sent to the callback (JWT)
                    } else {
                        throw new Error("Incorrect password");
                    }
                }
                catch(err:any){
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAccetingMessages;
                token.usernmae = user.username;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                 session.user._id = token._id
                 session.user.isVerified = token.isVerified;
                 session.user.isAccetingMessages = token.isAccetingMessages;
                 session.user.username = token.username;
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
}