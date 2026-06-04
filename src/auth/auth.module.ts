import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { EmailService } from "./email/email.service";
import { EmailModule } from './email/email.module';

@Module({
    imports: [ JwtModule.register({}), EmailModule ],
    controllers: [ AuthController ],
    providers: [ AuthService, JwtStrategy, EmailService ]
})

export class AuthModule{}