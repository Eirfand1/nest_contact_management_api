import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ValidationService } from './validation.service';
import databaseConfig from './database.config'
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { TypeOrmLogger } from './logger';
import { AuthMiddleware } from './auth.middleware';
import { Users } from '../user/entities/user.entity';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig]
    }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.Console()
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database')
      })
    }),
    TypeOrmModule.forFeature([Users])
  ],
  providers: [ValidationService, {
    provide: APP_FILTER,
    useClass: ErrorFilter
  }],
  exports: [ValidationService]
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*')
  }
}
