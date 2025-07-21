import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.mailgun.org',
          port: 587,
          secure: false,
          tls: {
            rejectUnauthorized: false,
          },
          auth: {
            user: configService.get('MAILGUN_USER'),
            pass: configService.get('MAILGUN_PASS'),
          },
        },
        defaults: {
          from: 'automacao1@i4t.ai',
        },
      }),
    }),
  ],
  providers: [EmailService],
})
export class EmailModule {}
