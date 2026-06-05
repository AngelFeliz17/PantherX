import { Type } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator"
import { ItemCondition } from "generated/prisma/enums"
import { Trim } from "src/decorator"

export class ListingDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @MaxLength(100)
  title: string

  @IsString()
  @Trim()
  @IsOptional()
  description?: string

  @Min(0)
  @IsNumber()
  @Type(() => Number)
  price: number

  @IsEnum(ItemCondition)
  @IsNotEmpty()
  condition: ItemCondition

  @IsString()
  @Trim()
  @IsOptional()
  location?: string

  @IsString()
  @IsNotEmpty()
  categoryId: string

}