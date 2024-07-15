import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() categoryData: Partial<Category>): Promise<Category> {
    return this.categoriesService.create(categoryData);
  }
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) : Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }
  // @Patch(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ): Promise<Category> {
  //   return this.categoriesService.update(id, updateCategoryDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
