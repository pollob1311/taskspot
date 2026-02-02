import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'TaskSpot'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
                <h1 style="color: #0f172a; text-align: center;">Reset Your Password</h1>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    You requested a password reset for your TaskSpot account. Click the button below to set a new password. This link will expire in 1 hour.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                    If you didn't request this, you can safely ignore this email.
                </p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                    &copy; ${new Date().getFullYear()} TaskSpot. All rights reserved.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};
