import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Mail0AuthService } from './mail';
import { HotelService } from './hotels/hotels.service';
import { BookingService } from './booking/booking.service';
import { SequenceService } from './sequence/sequence.service';
import { UsersService } from './users/users.service';
import * as JSZip from 'jszip';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly emailRecipients: string[];
  private readonly prodOrNot: boolean;
  private readonly mainServer: string;
  private readonly workerServer: string;
  constructor(
    private configService: ConfigService,
    private mail0AuthService: Mail0AuthService,
    private hotelService: HotelService,
    private bookingService: BookingService,
    private sequenceService: SequenceService,
    private usersService: UsersService,
  ) {
    this.prodOrNot = this.configService.get<string>('PRODORNOT') === 'true';
    this.mainServer = this.configService.get<string>('MAIN_SERVER');
    this.workerServer = this.configService.get<string>('WORKER_SERVER');
    this.emailRecipients = this.prodOrNot
      ? [
          'maitysubham4041@gmail.com',
          'subham@sayngo.com',
          'goutam@sayngo.com',
          'subhaghanta325@gmail.com',
          'sukanta@sayngo.com',
        ]
      : ['razmaityofficial@gmail.com'];
  }

  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async keepServer1Warm() {
    try {
      const serverUrl = this.mainServer;
      await axios.get(serverUrl);
      this.logger.log(`Sent request to ${serverUrl} to keep the server warm`);
    } catch (error) {
      this.logger.error(
        'Error sending request to keep the server warm:',
        error,
      );
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async keepServer2Warm() {
    try {
      const serverUrl = this.workerServer;
      await axios.get(serverUrl);
      this.logger.log(`Sent request to ${serverUrl} to keep the server warm`);
    } catch (error) {
      this.logger.error(
        'Error sending request to keep the server warm:',
        error,
      );
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async sendDailyDbBackup() {
    try {
      const dbData = await this.getAllDbData();
      const zipBuffer = await this.createZipFile(dbData);

      for (const recipient of this.emailRecipients) {
        await this.sendEmail(recipient, zipBuffer);
      }

      this.logger.log('Daily DB backup sent successfully');
    } catch (error) {
      this.logger.error('Error sending daily DB backup:', error);
    }
  }
  private async createZipFile(data: any): Promise<Buffer> {
    const zip = new JSZip();
    zip.file('db_backup.json', JSON.stringify(data, null, 2));
    return zip.generateAsync({ type: 'nodebuffer' });
  }
  private async sendEmail(to: string, attachment: Buffer) {
    const environment = this.prodOrNot ? 'PRODUCTION' : 'DEVELOPMENT';
    const subject = `Daily ${environment} DB Backup`;
    const text = `Please find attached the daily ${environment.toLowerCase()} database backup.`;
    const html = `
    <h1>Daily ${environment} DB Backup</h1>
    <p>Environment: ${environment}</p>
    <p>Date: ${new Date().toISOString().split('T')[0]}</p>
    <p>Please find the attached ZIP file containing the ${environment.toLowerCase()} database backup.</p>
  `;

    await this.mail0AuthService.sendMail0Auth(to, subject, text, html, [
      {
        filename: 'db_backup.zip',
        content: attachment,
      },
    ]);
  }

  private async getAllDbData() {
    const hotels = await this.hotelService.findAll();
    const bookings = await this.bookingService.findAll();
    const sequences = await this.sequenceService.findAll();
    const users = await this.usersService.findAll();

    return {
      hotels,
      bookings,
      sequences,
      users,
    };
  }
}
