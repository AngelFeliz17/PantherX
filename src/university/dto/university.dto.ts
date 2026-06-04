import { IsNotEmpty, IsString } from "class-validator";

export class UniversityDto {
    @IsString()
    @IsNotEmpty()
    name: string
}

export class UpdateUniversityDto {
    @IsString()
    @IsNotEmpty()
    name?: string
}