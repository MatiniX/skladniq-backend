import * as nodemailer from 'nodemailer';

export async function sendEmail(to: string, html: string) {
  // vytvorí transporter object na posielanie emailov
  // podľa prostredia použije SMTP klienta on sendinblue alebo len lokálne pomocou ethereal
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'ubyqstdd2kbctm6q@ethereal.email',
      pass: 'GMn9rJV4JU8sYxAnc6',
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'your-todo-app <yourtodo@foo.com>', // sender address
    to: to,
    subject: 'Change password', // Subject line
    html: html,
  });

  console.log('Message sent: %s', info.accepted);

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
