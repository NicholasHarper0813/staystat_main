import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailConfig {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  /*-----------------------------------*/
  /**������������CONFIGURATION������������*/
  /*__________________________________*/
  //Common

  get defaultSenderGmail(): string {
    return (
      this.configService.get<string>('MAIL_SERVICE_DEFAULT_SENDER_GMAIL') ||
      Default_Gmail_EMAIL
    );
  }

  //0Auth2.0 Gmail
  get oauthGmailSenderClientId(): string {
    return (
      this.configService.get<string>(
        'MAIL0AUTH_SERVICE_GMAIL_SENDER_CLIENT_ID',
      ) || CLIENT_ID
    );
  }

  get oauthGmailSenderClientSecret(): string {
    return (
      this.configService.get<string>(
        'MAIL0AUTH_SERVICE_GMAIL_SENDER_CLIENT_SECRET',
      ) || CLIENT_SECRET
    );
  }

  get oauthGmailSenderRedirectUri(): string {
    return (
      this.configService.get<string>(
        'MAIL0AUTH_SERVICE_GMAIL_SENDER_REDIRECT_URI',
      ) || REDIRECT_URI
    );
  }

  get oauthGmailSenderRefreshToken(): string {
    return (
      this.configService.get<string>(
        'MAIL0AUTH_SERVICE_GMAIL_SENDER_REFRESH_TOKEN',
      ) || REFRESH_TOKEN
    );
  }

  get senderGmailAddress(): string {
    return (
      this.configService.get<string>('MAIL0AUTH_SERVICE_SENDER_GMAIL') ||
      ZeroAuth_Gmail_EMAIL
    );
  }
}

/*-----------------------------------*/
/**���������DEFAULT VALUE���������*/
/*__________________________________*/

//Gmail email--app-password
export const Default_Gmail_EMAIL: string = 'xyzs@xyzs.com';
export const Gmail_EMAIL: string = 'xyzs@xyzs.com';
export const Gmail_PASSWORD: string = 'xyzs xyzs xyzs xyzs';

//0Auth2.0 Gmail
export const CLIENT_ID: string =
  'xyzs00000000-f85xxxxxxxxxxxxxxxxxxxxxxdadxyzs.apps.googleusercontent.com';
export const CLIENT_SECRET: string = 'xyzsX--ppBUDXXXXXXQGuXXXsXXXXxyzs';
export const REDIRECT_URI: string =
  'https://developers.google.com/oauthplayground';
export const REFRESH_TOKEN: string =
  '1//xyzsfsfsfsf69f9sf9RAAGAQxyzs-xyzssgnv_WzDSFSFSF13zV6kdfdGSSFSFFqKNgI7fsfsfsfS9WgkWBA4xyzs_oZ8778xyzs';
export const ZeroAuth_Gmail_EMAIL: string =
  'codexam.personal@gmail.com' || 'codexam.personal@gmail.com';
