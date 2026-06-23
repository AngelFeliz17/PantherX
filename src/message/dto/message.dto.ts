import { IsNotEmpty, IsString } from "class-validator";
import { Trim } from "src/decorator";

export class MessageDto {
    @IsString()
    @IsNotEmpty()
    @Trim()
    content!: string
}