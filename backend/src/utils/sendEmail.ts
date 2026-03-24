import nodemailer from 'nodemailer';

const shouldSend = (): boolean =>
  Boolean(process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS);

export const sendEmail = async ({ to, subject, text }: { to: string; subject: string; text: string }): Promise<void> => {
  if (!shouldSend()) {
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `CEMS <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Email delivery failed (continuing without blocking request):', error);
  }
};
