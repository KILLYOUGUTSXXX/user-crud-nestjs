import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UsePipes, ValidationPipe, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from '@utilities/helper-type.util';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { UserActivateDTO } from './dto/activation-user.dto';

@Controller('users')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUserProfile(@Res() res: Response, @Req() req: Request, @Query() query: any) {
    return this.userService.getSomeUsers(query)
      .then(result => {
        res.asJson(
          HttpStatus.OK,
          {
            message: 'OK',
            data: result
          }
        )
      }).catch(er => {
        res.asJson(
          HttpStatus.BAD_REQUEST,
          { message: '[C-USER-A-01] Failed to fetch data users.' },
          { message: er.message }
        )
      })
  }

  @Post('/disabled')
  @UsePipes(ValidationPipe)
  disabledUser(@Res() res: Response, @Req() req: Request, @Body() data: UserActivateDTO) {
    return this.userService.bannedUser(data)
      .then(result => {
        res.asJson(
          HttpStatus.OK,
          {
            message: 'OK',
            data: result
          },
          { exec_by: req.user_auth.user_name, user_name: data.user_name, reason: data.reason }
        )
      }).catch(er => {
        res.asJson(
          HttpStatus.BAD_REQUEST,
          { message: '[C-USER-A-01] Failed to disable user.' },
          { message: er.message }
        )
      })
  }

  @Post('/enabled')
  @UsePipes(ValidationPipe)
  enabledUser(@Res() res: Response, @Req() req: Request, @Body() data: UserActivateDTO) {
    return this.userService.disBannedUser(data.user_name)
      .then(result => {
        res.asJson(
          HttpStatus.OK,
          {
            message: 'OK',
            data: result
          },
          { exec_by: req.user_auth.user_name, user_name: data.user_name, reason: data.reason }
        )
      }).catch(er => {
        res.asJson(
          HttpStatus.BAD_REQUEST,
          { message: '[C-USER-A-01] Failed to enable users.' },
          { message: er.message }
        )
      })
  }
}
