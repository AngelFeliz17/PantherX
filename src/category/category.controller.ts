import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryDto, UpdateCategoryDto } from './dto';
import { CategoryService } from './category.service';
import { JwtGuard } from 'src/auth/guard';
import { AdminGuard } from 'src/user/guard';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @UseGuards(AdminGuard)
    @Post()
    create(@Body() dto: CategoryDto) {
        return this.categoryService.create(dto);
    }

    @Get()
    findAll() {
        return this.categoryService.findAll()
    }

    @UseGuards(AdminGuard)
    @Get(':id')
    find(@Param('id') id: string) {
        return this.categoryService.find(id);
    }

    @UseGuards(AdminGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoryService.update(id, dto);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.categoryService.delete(id);
    }
}
