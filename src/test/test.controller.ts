import { Controller, Get } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller('test')
export class TestController {
  /**
   * Handler to answer to /test route
   */
  @Get()
  sayHello(): Observable<string> {
    return of('Hello test');
  }
}
