import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpException, HttpStatus, InternalServerErrorException, Query } from '@nestjs/common';
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

  @Get('category/:categoryId/check-unused')
  async checkCategoryUnused(@Param('categoryId') categoryId: number): Promise<{ unused: boolean }> {
    const unused = await this.productService.isCategoryUnused(categoryId);
    return { unused };
  }


  // @Get('category/:categoryId')
  // async findByCategoryId(@Param('categoryId') categoryId: number): Promise<Product[]> {
  //   console.log(`Received request to find products for category ID: ${categoryId}`);

  //   try {
  //     const products = await this.productService.findByCategoryId(categoryId);
  //     console.log(`Successfully found ${products.length} products for category ID: ${categoryId}`);
  //     return products;
  //   } catch (error) {
  //     console.error(`Error occurred while fetching products for category ID ${categoryId}: ${error.message}`);
  //     if (error instanceof NotFoundException) {
  //       throw error; // Re-throw NotFoundException so that HTTP 404 status is returned
  //     } else {
  //       throw new InternalServerErrorException('An unexpected error occurred while fetching products');
  //     }
  //   }
  // }

  @Get('category/:categoryId')
  async findByCategoryId(@Param('categoryId') categoryId: number): Promise<Product[]> {
    return this.productService.findByCategoryId(categoryId);
  }


  // @Get('price/:price')
  // async getByPrice(@Param('price') price: number): Promise<Product[]> {
  //   if (isNaN(price)) {
  //     throw new NotFoundException('Price query parameter must be a number');
  //   }
  //   return this.productService.findByPrice(price);
  // }


  @Get('price/:price')
  async getByPrice(@Param('price') price: string): Promise<Product[]> {
    const parsedPrice = parseFloat(price);
    
    if (isNaN(parsedPrice)) {
      throw new NotFoundException('Price query parameter must be a valid number');
    }

    const products = await this.productService.findByPrice(parsedPrice);

    // Handle the case where no products are found
    if (products.length === 0) {
      throw new NotFoundException(`No products found with price ${parsedPrice}`);
    }

    return products;
  }
  @Get('title/:title')
  async getByTitle(@Param('title') title: string): Promise<Product[]> {
    if (!title) {
      throw new NotFoundException('Title query parameter is required');
    }
    return this.productService.findByTitle(title);
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

