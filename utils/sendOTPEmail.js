import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email,subject,message) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html:message,
  };

  await transporter.sendMail(mailOptions);
};



// import nodemailer from 'nodemailer';

// export const sendOTPEmail = async (email, subject, message) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.titan.email', // BigRock SMTP server
//     port: 465,                   
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false,   
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: subject,
//     html: message,
//   };

//   await transporter.sendMail(mailOptions);
// };
