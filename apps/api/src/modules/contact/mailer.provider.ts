/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

export const MAIL_TRANSPORT = 'MAIL_TRANSPORT';

export const MailerProvider: Provider = {
  provide: MAIL_TRANSPORT,
  inject: [ConfigService],
  useFactory: (cfg: ConfigService): Transporter => {
    const host = cfg.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const port = Number(cfg.get<string>('SMTP_PORT', '587'));
    const user = cfg.get<string>('EMAIL_USER');
    const pass = cfg.get<string>('EMAIL_PASS');

    if (!user || !pass) throw new Error('EMAIL_USER/EMAIL_PASS must be set');
    const secure = port === 465; // 465=SSL, 587=STARTTLS

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  },
};
