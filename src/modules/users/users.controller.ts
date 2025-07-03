// src/user/user.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { FirebaseUser } from './entities/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('preferences') preferences: FirebaseUser['preferences'],
  ): Promise<FirebaseUser> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.userService.createUser(email, password, { preferences });
  }

  @Get(':uid')
  async getUser(@Param('uid') uid: string): Promise<FirebaseUser | null> {
    return this.userService.getUser(uid);
  }

  @Post('verify-token')
  async verifyToken(@Body('idToken') idToken: string): Promise<any> {
    if (!idToken) throw new BadRequestException('idToken is required');
    return this.userService.verifyToken(idToken);
  }
}
