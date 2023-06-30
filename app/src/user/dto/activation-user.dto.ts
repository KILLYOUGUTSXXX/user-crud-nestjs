import { Type } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UserActivateDTO {
  @IsString()
  @IsNotEmpty()
  readonly user_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  readonly reason: string;
}
