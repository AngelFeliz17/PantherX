import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @MinLength(8)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString() 
  password: string;
}

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string

    @MinLength(8)
    @IsNotEmpty()
    @IsString()
    newPassword: string
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class ChangeForgottenPasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string

  @IsNotEmpty()
  @IsString()
  newPasswordConfirmation: string
}

export class EmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}