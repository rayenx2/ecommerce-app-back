import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsGateway } from './products.gateway';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsGateway, ProductsService],
  
})
export class ProductsModule {}
