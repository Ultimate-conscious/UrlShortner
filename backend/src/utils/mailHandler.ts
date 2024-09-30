import nodemailer from 'nodemailer';

export const resetPasswordMail = async (OTP:number,email:string):Promise<void>=>{

    let transporter = nodemailer.createTransport({
        //@ts-ignore
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
      });

    const mailOptions = {
        to: email,
        from: process.env.MAIL_USERNAME,
        subject: 'Password Reset | UrlShortner',
        text: `Your OTP to reset your password is ${OTP}. \n\n
        The OTP will expire in 10 minutes.`
    };
    try{
        await transporter.sendMail(mailOptions);
    }catch(e){
        console.log("error while sending the email")
    }
}