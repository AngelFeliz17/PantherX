import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";

@Injectable()
export class VerifiedGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException();
        }

        if (!user.verified) {
            throw new ForbiddenException('Verify your account before creating listings');
        }

        return true;
    }
}