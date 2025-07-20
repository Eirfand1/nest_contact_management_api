import { Logger, QueryRunner } from 'typeorm';
import * as winston from 'winston';
import { Injectable } from '@nestjs/common';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

@Injectable()
export class TypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    logger.debug(`Query: ${query}${parameters?.length ? ` -- Params: ${JSON.stringify(parameters)}` : ''}`);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    logger.error(`Query Error: ${error} -- Query: ${query}${parameters?.length ? ` -- Params: ${JSON.stringify(parameters)}` : ''}`);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    logger.warn(`Slow Query (${time}ms): ${query}${parameters?.length ? ` -- Params: ${JSON.stringify(parameters)}` : ''}`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    logger.info(`Schema Build: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    logger.info(`Migration: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    logger.log(level, message);
  }
}
