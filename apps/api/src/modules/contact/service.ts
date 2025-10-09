/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// apps/backend/src/modules/contact/service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';
import { MAIL_TRANSPORT } from './mailer.provider';
import type { ContactDto } from '@dtos';

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
}

type AuthedUser = { id: string; email?: string | null; role?: string | null };

@Injectable()
export class ContactService {
  constructor(
    @Inject(MAIL_TRANSPORT) private readonly mailer: Transporter,
    private readonly cfg: ConfigService,
  ) {}

  async send(dto: ContactDto, user?: AuthedUser) {
    const from =
      this.cfg.get<string>('CONTACT_FROM') ||
      this.cfg.get<string>('EMAIL_USER')!;
    const to =
      this.cfg.get<string>('CONTACT_TO') || this.cfg.get<string>('EMAIL_USER')!;

    const subject = dto.subject?.trim() || `New contact from ${dto.name}`;
    const text = `Name: ${dto.name}
Email: ${dto.email}

${dto.message}

---
User (authed): ${user?.id ?? 'n/a'} ${user?.email ? `<${user.email}>` : ''}`.trim();

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
        <p><strong>Name:</strong> ${escapeHtml(dto.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(dto.email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap">${escapeHtml(dto.message)}</pre>
        <hr />
        <p style="color:#666"><small>User (authed): ${escapeHtml(user?.id ?? 'n/a')}${
          user?.email ? ' &lt;' + escapeHtml(user.email) + '&gt;' : ''
        }</small></p>
      </div>
    `;

    const info = await this.mailer.sendMail({
      from,
      to,
      subject,
      text,
      html,
      replyTo: `"${dto.name}" <${dto.email}>`,
    });

    return { ok: true, id: info.messageId };
  }
}
