import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators';
import { sendEmail } from './common/helpers/send-email';
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  getProtectedHello(): string {
    return 'Hello user';
  }

  @Get('email')
  @Public()
  async emailTest() {
    await sendEmail('somenone@email.com', '<p>this is just a test</p>');

    return 'email sent';
  }
}
