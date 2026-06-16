import { Body, Controller, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ChangeForgottenPasswordDto, ChangePasswordDto, EmailDto, ForgotPasswordDto, LogInDto, SignUpDto, VerifyCodeDto } from "./dto";
import { GetUser } from "./decorator";
import type { User } from "generated/prisma/client";
import { JwtGuard } from "./guard";
import type { Response } from "express";
import { COOKIE_OPTIONS } from "@/reusable";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post('signup')
    signUp(@Body() dto: SignUpDto){
        return this.authService.signUp(dto);
    }

    @Post('login')
    logIn(@Body() dto: LogInDto, @Res({ passthrough: true }) res: Response){
        return this.authService.logIn(dto, res);
    }

    @Post("logout")
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", COOKIE_OPTIONS);
    return {
        message: "Logged out successfully",
    };
    }

    @Post('generate-code')
    generateCode(@Body() dto: EmailDto) {
        return this.authService.generateCode(dto);
    }

    @Put('verify-code')
    verifyCode(@Body() dto: VerifyCodeDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.verifyCode(dto, res);
    }

    @UseGuards(JwtGuard)
    @Put('change-password')
    changePassword(@GetUser() user: User, @Body() dto: ChangePasswordDto) {
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