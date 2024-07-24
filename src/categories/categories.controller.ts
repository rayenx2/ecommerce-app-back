import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
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

  @Get('name/:name')
  async getCategoryByName(@Param('name') name: string): Promise<Category[]> {
    console.log(name);
    if (!name) {
      throw new NotFoundException('name parameter is required');
    }
    return this.categoriesService.getCategoryByName(name);
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
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.categoriesService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error; // Rethrow known exceptions to handle them in the API response
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
