import {
  Controller,
  Get,
  Session,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('visits')
  getVisits(@Session() session: Record<string, any>) {
    session.visits = session.visits ? session.visits + 1 : 1;
    return session.visits;
  }

  @Get('getCookies')
  getCookies(@Request() request) {
    console.log(request.cookies);
    console.log(request.cookies['key1']);
    console.log(request.cookies.signedCookies);
  }

  @Get('setCookies')
  setCookies(@Response({ passthrough: true }) response) {
    response.cookie('key1', 'value', {
      maxAge: 1000 * 60 * 10,
      httpOnly: true,
    });
    response.cookie('key2', 'value', {
      maxAge: 1000 * 60 * 10,
      signed: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
