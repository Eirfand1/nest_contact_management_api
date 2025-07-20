import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // Register
  describe('POST /api/users', () => {
    it('should be rejected if reqeust is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: ''
        })

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  })

  describe('POST /api/users', () => {
    it('should be able register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'tes',
          password: 'testing123',
          name: "PT Testing"
        })
      expect(response.status).toBe(201);
      expect(response.body.username).toBe('tes');
      expect(response.body.password).toBe('testing123');
      expect(response.body.name).toBe('PT Testing');
    });
  })

  // Login
  describe('POST /api/users/login', () => {
    it('should be rejected if reqeust is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        })
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  })

  describe('POST /api/users/login', () => {
    it('should success if reqeust is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'tes',
          password: 'testing123',
        })
      expect(response.status).toBe(200);
    });
  })

});
