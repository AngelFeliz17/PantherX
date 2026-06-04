import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from "resend";

@Injectable()
export class EmailService {
    private readonly resend: Resend;
    constructor(private config: ConfigService) {
        console.log(this.config.get('RESEND_API_KEY'));
        this.resend = new Resend(this.config.get("RESEND_API_KEY"));
    }

    async sendVerificationCode(email: string, firstName: string, code: string, expiresAt: Date) {
        try {
            const formattedDate = expiresAt.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
            
            await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'angelsfeliz@hotmail.com',
                subject: 'Verification Code',
                html: `
                    <h2>Email Verification</h2>

                    <p>Hi ${firstName},</p>

                    <p>Your verification code is:</p>

                    <h1>${code}</h1>

                    <p>This code expires at ${formattedDate}.</p>

                    <p>If you didn't request this code, you can ignore this email.</p>
            `,
            });
        } catch (error) {
            console.error(error)
        }
    }

    async sendWelcomingEmail(email: string, firstName: string) {
        try {
            await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'angelsfeliz@hotmail.com',
                subject: 'Welcome to Student Marketplace',
                html: `
                    <h2>Welcome to Panther Marketplace, ${firstName} 🎉</h2>

                    <p>
                    Your account has been successfully verified and we're excited to have you join our community.
                    </p>

                    <p>
                    You can now buy, sell, and connect with other students on campus.
                    </p>

                    <p>
                    Thanks for joining us, and we hope you have a great experience.
                    </p>

                    <p>
                    Go Panthers! 💜💛
                    </p>

                    <br>

                    <p>
                    Best regards,<br>
                    Panther Marketplace Team
                    </p>
            `,
            });
        } catch (error) {
            console.error(error)
        }
    }

    async sendVerificationToken(token: string, email: string) {
        try {
            await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'angelsfeliz@hotmail.com',
                subject: 'Forgot Your Password?',
                html: `
                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset Your Password</h2>

                    <p>
                        We received a request to reset the password for your Panther Marketplace account.
                    </p>

                    <p>
                        Click the button below to choose a new password:
                    </p>

                    <p style="margin: 30px 0;">
                        <a
                        href="{{RESET_URL}}"
                        style="
                            background-color: #4F46E5;
                            color: white;
                            padding: 12px 24px;
                            text-decoration: none;
                            border-radius: 6px;
                            display: inline-block;
                        "
                        >
                        Reset Password
                        </a>
                    </p>

                    <p>
                        This link will expire in 10 minutes.
                    </p>

                    <p>
                        If you didn't request a password reset, you can safely ignore this email.
                    </p>

                    <hr />

                    <p style="font-size: 12px; color: #666;">
                        Student Marketplace Team
                    </p>

                    <p>
                    If the button doesn't work, copy and paste this link into your browser:
                    </p>

                    <p>
                    <a href="{{RESET_URL}}">
                        {{RESET_URL}}
                    </a>
                    </p>
                </div>
                `,
            });
        } catch (error) {
            console.error(error)
        }
    }
}
