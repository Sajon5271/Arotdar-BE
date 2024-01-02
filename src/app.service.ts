import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string } {
    return { message: 'Hello World. Testing nest app' };
  }
}
