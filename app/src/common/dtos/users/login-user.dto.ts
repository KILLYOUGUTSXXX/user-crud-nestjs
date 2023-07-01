import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  readonly user_name: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
