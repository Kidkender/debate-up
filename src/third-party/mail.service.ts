import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { ConfigType } from 'src/config/config';
import { SendMailDto } from './dto/sendMail.dto';

@Injectable()
export class EmailService {
  private mailTransport: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService<ConfigType>) {
    const config = this.configService.get('mail');
    this.mailTransport = createTransport({
      host: config.host,
      port: Number(config.port),
      secure: false,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  async sendEmail(data: SendMailDto): Promise<{ success: boolean } | null> {
    const { sender, recipients, subject, html, text } = data;

    const mailOptions: SendMailOptions = {
      from: sender ?? {
        name: this.configService.get('mail').sender_name_default,
        address: this.configService.get('mail').mail_sender_default,
      },
      to: recipients,
      subject,
      html,
      text,
    };

    try {
      await this.mailTransport.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      this.logger.error('Failed send emal request: ' + error);
      throw new BadRequestException('send mail error: ', error);
    }
  }
}
