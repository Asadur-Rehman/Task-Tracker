import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get('/hello')
  getHello(@Req() request: Request): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return 'Hello ' + request['user']?.email + '!';
  }
}
