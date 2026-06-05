import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainDto, UpdateDomainDto } from './dto/domain.dto';
import { JwtGuard } from 'src/auth/guard';
import { AdminGuard } from 'src/user/guard';

@UseGuards(JwtGuard, AdminGuard)
@Controller('domains')
export class DomainController {
    constructor( private domainServices: DomainService ) {}

    @Post()
    create(@Body() dto: DomainDto) {
        return this.domainServices.create(dto)
    }

    @Get()
    findAll() {
        return this.domainServices.findAll();
    }

    @Get(':id')
    find(@Param('id') id: string) {
        return this.domainServices.find(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateDomainDto) {
        return this.domainServices.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.domainServices.delete(id);
    }
}   
 