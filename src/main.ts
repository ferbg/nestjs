import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //  Session
  app.use(
    session({ secret: 'my-secret', resave: false, saveUninitialized: false }),
  );
  //  Cookies
  app.use(cookieParser('1234'));

  await app.listen(3000);
}
bootstrap();
