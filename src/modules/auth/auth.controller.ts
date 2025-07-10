import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { FirebaseLoginResponse } from './auth.service';

@Controller('auth')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.login(email, password);
  }
}
