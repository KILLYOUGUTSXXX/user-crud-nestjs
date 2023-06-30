import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from '@utilities/helper-type.util';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { UpdateBasicInfoUserDTO } from './dto/update-basic-info.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getProfile')
  getUserProfile(@Res() res: Response, @Req() req: Request) {
    return this.userService.getUserIfExists(req.user_auth.user_name, 'bf')
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
          { message: '[C-USER-01] Failed to fetch user info.' },
          { message: er.message }
        )
      })
  }

  @Post('/register')
  @UsePipes(ValidationPipe)
  registerUser(@Res() res: Response, @Body() data: RegisterUserDTO) {
    return this.userService.registerUser(data)
      .then(result => {
        res.asJson(
          HttpStatus.OK,
          {
            message: 'Your account has been registered.',
            data: {
              user_name: result.user_name,
              created_at: result.created_at,
              email: result.email 
            }
          },
          { user_name: result.user_name }
        )
      }).catch(er => {
        res.asJson(
          HttpStatus.BAD_REQUEST,
          { message: '[C-USER-02] Failed to register account.' },
          { message: er.message }
        )
      })
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  loginUser (@Res() res: Response, @Req() req: Request, @Body() data: LoginUserDTO) {
    return this.userService.loginUser(data, req.client_informations)
      .then(result => {
        res.asJson(
          HttpStatus.OK,
          {
            message: 'Login is authenticated.',
            data: { token: result.token, user_name: data.user_name }
          }
        )
      }).catch(er => {
        res.asJson(
          HttpStatus.BAD_REQUEST,
          {
            message: `[C-USER-03] Failed to access account ${data.user_name}.`,
            detailMessage: er.message
          },
          { message: er.message }
        )
      })
  }

  @Patch('/updateProfile/:userName')
  @UsePipes(ValidationPipe)
  updateUserProfile (@Res() res: Response, @Param('userName') userName: string, @Req() req: Request, @Body() data: UpdateBasicInfoUserDTO ) {
    return this.userService.updateBasicInfoUser(userName, data)
      .then(result => {
        res.asJson(
          HttpStatus.OK,
          { message: 'OK' }
        )
      }).catch(er => {
        res.asJson(
          HttpStatus.BAD_REQUEST,
          {
            message: `[C-USER-04] Failed to update user info.`,
            detailMessage: er.message
          },
          { message: er.message }
        )
      })
  }
}
