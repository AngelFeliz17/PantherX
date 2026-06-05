import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { Trim } from "src/decorator";

export class DomainDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Matches(
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        { message: "Invalid domain format" }
    )
    domain: string

    @IsString()
    @IsNotEmpty()
    universityId: string
}

export class UpdateDomainDto {
    @IsString()
    @Trim()
    @IsOptional()
    @Matches(
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        { message: "Invalid domain format" }
    )
    domain?: string
}