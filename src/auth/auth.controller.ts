import * as bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

import {
  Controller,
  Get,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiProperty, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginGuard } from './guards/login.guard';
import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';
import { BasicAuthGuard } from './guards/basic-auth.guard';

class LoginDTO {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseGuards(LoginGuard)
  @Post('auth/login')
  @ApiSecurity('basic')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBody({
    description: 'username & credentials',
    type: LoginDTO
  })
  async login(@Request() req, @Session() session) {
    const response = await this.authService.login(req.user);
    session.user = response.payload;
    return { token: response.token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: 'Forbidden.'})
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
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: 'Forbidden.'})
  getRoles(@Request() req) {
    return req.user.roles;
  }

  @UseGuards(BasicAuthGuard)
  @Get('cifrado')
  @ApiOkResponse()
  @ApiBasicAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: 'Unauthorized'})
  async cifrado() {
    const iv = randomBytes(16);
    const password = 'secretKey';
    // generando la clave de cifrado
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const textToEncrypt = 'changeme';
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);
    // Descrifrado
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    // Devolviendo los valores
    return {
      textToCifer: textToEncrypt,
      encryptedText: encryptedText.toString(),
      decryptedText: decryptedText.toString(),
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get('hash')
  @ApiBasicAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: 'Unauthorized'})
  async hash() {
    const saltOrRounds = 10;
    const password = 'changeme';
    // Generamos el hash
    const hash = await bcrypt.hash(password, saltOrRounds);
    const salt = await bcrypt.genSalt();
    // Comparamos el valor
    const isMatch = await bcrypt.compare(password, hash);
    return {
      hash: hash,
      salt: salt,
      isMatch: isMatch,
    };
  }
}
