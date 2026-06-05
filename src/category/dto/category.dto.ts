import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Trim } from "src/decorator";

export class CategoryDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    name: string
}

export class UpdateCategoryDto {
    @IsString()
    @Trim()
    @IsOptional()
    name?: string
}