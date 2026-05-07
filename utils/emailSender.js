import nodemailer from "nodemailer"

export async function sendVerificationCode(userEmail, code) {
        const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                },
        });

        return transporter.sendMail({
                from: `"Uygun Markets" <${process.env.EMAIL_USER}>`,
                to: userEmail,
                subject: "Your Verification Code",
                text: `Your 6-digit code is: ${code}`,
                html: `<b>Your 6-digit code is: ${code}</b>`,
        });
}