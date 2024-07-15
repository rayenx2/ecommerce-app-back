import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return product;
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const products = await this.productRepository.find({ where: { category } });
    if (!products.length) {
      throw new NotFoundException(`No products found in category with ID ${categoryId}`);
    }
    return products;
  }


  // async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
  //   const product = await this.productRepository.preload({
  //     //id: id,
  //     ...updateProductDto,
  //   });
  
  //   if (!product) {
  //     console.error(`Product with ID ${id} not found`);
  //     throw new NotFoundException(`Product with ID ${id} not found`);
  //   }
  //   console.log(`Product found:`, product);
  //   return this.productRepository.save(product);
  // }
  // async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
  //   console.log(`Updating product with ID: ${id}`);
  //   console.log('Update data:', updateProductDto);
  
  //   // Check if the product exists before preloading
  //   const existingProduct = await this.productRepository.findOneBy({id});
  //   if (!existingProduct) {
  //     console.error(`Product with ID ${id} not found`);
  //     throw new NotFoundException(`Product with ID ${id} not found`);
  //   }
  
  //   console.log('Existing product found:', existingProduct);
  
  //   // Preload the product entity
  //   const product = await this.productRepository.preload({
  //     id: id,
  //     ...updateProductDto,
  //   });
  
  //   if (!product) {
  //     console.error('Preload failed, product is undefined');
  //     throw new NotFoundException(`Product with ID ${id} not found`);
  //   }
  
  //   console.log('Product after preload:', product);
  
  //   // Save the updated product
  //   return this.productRepository.save(product);
  // }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const { categoryId, ...rest } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...rest,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      product.category = category;
    }

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }



}