import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('FIREBASE_API_KEY');
    console.log('Firebase API Key from ENV:', key);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
