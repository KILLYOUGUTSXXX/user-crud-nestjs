import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";

export class ChangePasswordUserDTO {
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/g,
    { message: 'Password must contains at least 1 lowercase, uppercase, number and special characters, with the length password in 8-32 characters.' }
  )
  readonly newPassword: string;
}