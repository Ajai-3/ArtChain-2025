  import nodemailer from 'nodemailer';

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  async function sendEmail(mailOptions: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        ...mailOptions
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  export { sendEmail };