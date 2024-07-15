import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';


@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productService.create(createProductDto);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }



  @Get(':id')
  async findById(@Param('id') id: number): Promise<Product> {
    return this.productService.findById(id);
  }


  @Get('category/:categoryId')
  async findByCategoryId(@Param('categoryId') categoryId: number): Promise<Product[]> {
    return this.productService.findByCategoryId(categoryId);
  }
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productService.update(id, updateProductDto);
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }

}
