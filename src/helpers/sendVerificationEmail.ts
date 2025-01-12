import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'gmail',
  port: 587,
  secure: false, // or 'STARTTLS'
  auth: {
      user: "anuragsharda131@gmail.com",
      pass: "ousbpkkzrkospnso"
      }
});

const sendOTP = (email: string, username: string, verifyCode: string) => {
  
  const mailOptions = {
      from: "anuragsharda131@gmail.com",
      to: email,
      subject: "Verify Account",
      html: `
      <p>Here&apos;s your verification code: <b>${verifyCode}</b></p>
        <div>
          <div>
            <Heading as="h2">Hello ${username},</Heading>
          </div>
          <div>
            <p>
              Thank you for registering. Please use the following verification
              code to complete your registration:
            </p>
          </div>
          <div>
            <b>${verifyCode}</b> 
          </div>
          <div>
            <p>
              If you did not request this code, please ignore this email.
            </p>
          </div>
        </div>`
  }
  
  transporter.sendMail(mailOptions, (error, info)=>{
    if (error) {
      console.log("Error: ", error);
      return {success:false};
    }
    console.log('Email sent: ' + info.response);
    return {success:true};
  });
}

export default sendOTP;