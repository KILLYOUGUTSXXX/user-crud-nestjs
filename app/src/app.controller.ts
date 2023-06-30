import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Response } from '@utilities/helper-type.util'
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response, @Req() req: Request) {
    return res.asJson(HttpStatus.OK, {
      message: this.appService.getHello()
    })
  }
}
