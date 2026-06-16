import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "generated/prisma/enums";
import { Trim } from "src/decorator";

export class UserDto {
    @IsNotEmpty()
    @IsEmail()
    @Trim()
    email!: string;
    
    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsNotEmpty()
    @IsString()
    @Trim()
    name!: string

    @IsNotEmpty()
    @IsString()
    @Trim()
    bio?: string

    @IsNotEmpty()
    @IsString()
    @Trim()
    profilePicture?: string

    @IsNotEmpty()
    @IsString()
    @Trim()
    graduationYear?: string
}

export class RoleDto {
    @IsEnum(UserRole)
    role!: UserRole;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Trim()
    name?: string
    
    @IsOptional()
    @IsEmail()
    @Trim()
    email?: string

    @IsOptional()
    @IsString()
    @Trim()
    bio?: string
    
    @IsOptional()
    @IsString()
    profilePicture?: string

    @IsOptional()
    @IsString()
    @Trim()
    graduationYear?: string
}