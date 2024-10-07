import nodemailer from 'nodemailer';
import { GmailPassword, Sender } from '../constants.js';

const passwordRecover = async (reciever, token) => {
  try {
    console.log(`Reciver ${reciever}`)
    // Create a Nodemailer transporter object using the Gmail service
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: Sender, 
        pass: GmailPassword,
      },
    });

    // Email options
    let mailOptions = {
      from: Sender, 
      to: reciever, 
      subject: "Reset Password Token",
  text: `This is the Token: ${token} to reset your password`,
  html: `<p>Dear user,</p><p>This is your token: <strong>${token}</strong> to reset your password. Click <a href="your-reset-link">here</a> to reset.</p><p>Regards,<br>Your App Team</p>`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    // Return success response
    return {message:"Send Token successful"};
  } catch (error) {
    // Log detailed error if it occurs
    console.error('Failed while sending E-Mail:', error.message);
    return {message:"Failed  to send Token "};
  }
};

export { passwordRecover };
