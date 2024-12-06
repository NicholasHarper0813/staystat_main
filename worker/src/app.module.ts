import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './common';
import { ScheduleModule } from '@nestjs/schedule';
import { BookingModule } from './booking/booking.module';
import { UsersModule } from './users/users.module';
import { SequenceModule } from './sequence/sequence.module';
import { AuthModule } from './auth/auth.module';
import { Mail0AuthModule, Mail0AuthService } from './mail';
import { HotelsModule } from './hotels/hotels.module';
import { HotelService } from './hotels/hotels.service';
import { BookingService } from './booking/booking.service';
import { UsersService } from './users/users.service';
import { SequenceService } from './sequence/sequence.service';
import { HotelRepository } from './hotels/repository/hotel.repository';
import { BookingRepository } from './booking/repository/booking.repository';
import { SequenceRepository } from './sequence/repository/sequence.repository';
import { UsersRepository } from './users/repository/users.repository';
import { Hotel, HotelSchema } from './hotels/model/hotel.model';
import { Booking, BookingSchema } from './booking/model/booking.model';
import { User, UserSchema } from './users/model/users.model';
import { Sequence, SequenceSchema } from './sequence/model/sequence.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sequence.name, schema: SequenceSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 3,
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    BookingModule,
    HotelsModule, // Add this line
    UsersModule,
    SequenceModule,
    AuthModule,
    Mail0AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    HotelService,
    BookingService,
    UsersService,
    SequenceService,
    Mail0AuthService,
    HotelRepository,
    BookingRepository,
    SequenceRepository,
    UsersRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
