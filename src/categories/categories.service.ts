import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    category.name = updateCategoryDto.name;
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOneBy({id});
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoryRepository.remove(category);
  }
}
