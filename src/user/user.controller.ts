import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import type { User, UserRole } from 'generated/prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { RoleDto, UpdateUserDto } from './dto/user.dto';
import { AdminGuard } from './guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @UseGuards(AdminGuard)
    @Get()
    findAll() {
        return this.userService.findAll()
    }

    @UseGuards(AdminGuard)
    @Get(':id')
    find(@Param('id') id: string) {
        return this.userService.find(id);
    }

    @UseGuards(AdminGuard)
    @Patch(':id/role')
    updateRole(@Param('id') id: string, @Body() dto: RoleDto) {
        return this.userService.updateRole(id, dto);
    }

    @Patch('me')
    update(@GetUser() user: User, @Body() dto: UpdateUserDto) {
        return this.userService.update(user, dto);
    }

    @Delete('me')
    delete(@GetUser() user: User) {
        return this.userService.delete(user);
    }
}
