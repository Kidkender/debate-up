import { Address } from 'nodemailer/lib/mailer';

export class SendMailDto {
  sender?: Address;
  recipients: Address[];
  subject: string;
  html: string;
  text?: string;
}
