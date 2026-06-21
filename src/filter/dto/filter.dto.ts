import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumberString, IsNumber } from "class-validator";
import { Trim } from "src/decorator";

export class FilterDto {
    @IsOptional()
    @IsString()
    @Trim()
    categoryId?: string;

    @IsOptional()
    @IsString()
    @Trim()
    condition?: string;

    @IsOptional()
    @Trim()
    @Type(() => Number)
    @IsNumber()
    minPrice?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Trim()
    maxPrice?: string;

    @IsOptional()
    @IsString()
    @Trim()
    search?: string;
}