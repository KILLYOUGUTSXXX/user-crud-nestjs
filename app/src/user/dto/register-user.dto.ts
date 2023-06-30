import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";

export class RegisterUserDTO {
  @IsString()
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{5,40}$/g,
    { message: 'Username must contain at least 1 lowercase or uppercase and number, with the length password in 5-40 characters.' }
  )
  user_name: string;
  
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Wrong format of Email.' })
  email: string;

  
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/g,
    { message: 'Password must contains at least 1 lowercase, uppercase, number and special characters, with the length password in 8-32 characters.' }
  )
  password: string;
}