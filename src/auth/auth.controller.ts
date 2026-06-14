import { Body, Controller, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ChangeForgottenPasswordDto, ChangePasswordDto, EmailDto, ForgotPasswordDto, LogInDto, SignUpDto, VerifyCodeDto } from "./dto";
import { GetUser } from "./decorator";
import type { User } from "generated/prisma/client";
import { JwtGuard } from "./guard";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post('signup')
    signUp(@Body() dto: SignUpDto){
        return this.authService.signUp(dto);
    }

    @Post('login')
    logIn(@Body() dto: LogInDto){
        return this.authService.logIn(dto);
    }

    @Post('generate-code')
    generateCode(@Body() dto: EmailDto) {
        return this.authService.generateCode(dto);
    }

    @Put('verify-code')
    verifyCode(@Body() dto: VerifyCodeDto) {
        return this.authService.verifyCode(dto);
    }

    @UseGuards(JwtGuard)
    @Put('change-password')
    changePassword(@GetUser() user: User, @Body() dto: ChangePasswordDto) {
        console.log(user)
        return this.authService.changePassword(user, dto);
    }

    @Post('forgot-password')
    sendForgotPasswordEmail(@Body() dto: ForgotPasswordDto) {
        return this.authService.sendForgotPasswordEmail(dto);
    }

    @Put('reset-password/:token')
    changeForgottenPassword(@Body() dto: ChangeForgottenPasswordDto, @Param('token') token: string) {
        return this.authService.changeForgottenPassword(token, dto);
    }
}