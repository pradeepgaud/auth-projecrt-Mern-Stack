// // import nodemailer from "nodemailer";

// // const transporter = nodemailer.createTransport({
// //   host :"smtp-relay.brevo.com",
// //   port:587,
// //   auth:{
// //     user:process.env.SMPT_USER,
// //     user:process.env.SMPT_PASS,

// //   }
// // });

// // export default transporter;

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export default transporter;

// Config/NodeMailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // use TLS via STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
