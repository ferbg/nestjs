import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import flash = require('connect-flash');

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

  // Después de inicializar la app
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(3000);
}
bootstrap();
