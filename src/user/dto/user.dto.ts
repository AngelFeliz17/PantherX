import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "generated/prisma/enums";

export class UserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    bio: string

    @IsNotEmpty()
    @IsString()
    profilePicture: string

    @IsNotEmpty()
    @IsString()
    graduationYear: string
}

export class RoleDto {
    @IsEnum(UserRole)
    role: UserRole
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName?: string
    
    @IsOptional()
    @IsString()
    lastName?: string
    
    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    bio?: string
    
    @IsOptional()
    @IsString()
    profilePicture?: string

    @IsOptional()
    @IsString()
    graduationYear?: string
}