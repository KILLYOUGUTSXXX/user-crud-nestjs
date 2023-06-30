import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

export class UpdateBasicInfoUserDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  readonly display_name: string;

  @IsDateString()
  @IsOptional()
  readonly birthday: Date;

  @IsEnum([['M', 'F', 'O']], { message: 'Gender is not defined.' })
  @IsOptional()
  readonly gender: string;

  @IsNumber()
  @IsOptional()
  readonly height: number;

  @IsNumber()
  @IsOptional()
  readonly weight: number;

  @IsString()
  @IsOptional()
  readonly curr_img_url: string;

  @IsString()
  @IsOptional()
  readonly last_update_at: number;

  @IsString()
  @IsOptional()
  readonly interest: number;
}
