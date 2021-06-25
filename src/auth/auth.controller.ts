import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginGuard } from './guards/login.guard';
import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseGuards(LoginGuard)
  @Post('auth/login')
  async login(@Request() req, @Session() session) {
    const response = await this.authService.login(req.user);
    session.user = response.payload;
    return { token: response.token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('miguard')
  @UseGuards(AuthenticatedGuard)
  getGuard() {
    return 'logueado';
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AuthenticatedGuard)
  @Get('roles')
  @Roles(Role.Admin)
  getRoles(@Request() req) {
    return req.user.roles;
  }
}
