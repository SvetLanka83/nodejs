import nodemailer, { Transporter } from "nodemailer";

import { config } from "../configs/config";

class EmailService {
    private transporter: Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASSWORD,
            },
        });
    }
    public async sendEmail(): Promise<void> {
        await this.transporter.sendMail({
            to: "krasnopolsky.anatoliy@gmail.com",
            subject: "Hello",
            text: "Hello from nodemaler",
        });
    }
}
export const emailService = new EmailService();
