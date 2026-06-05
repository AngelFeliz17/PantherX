import { IsNotEmpty, IsString } from "class-validator";
import { Trim } from "src/decorator";

export class UniversityDto {
    @IsString()
    @IsNotEmpty()
    @Trim()
    name: string
}

export class UpdateUniversityDto {
    @IsString()
    @IsNotEmpty()
    @Trim()
    name?: string
}