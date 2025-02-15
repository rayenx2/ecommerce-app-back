import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ProductsModule,TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres', 
    password: 'root', 
    database: 'data-commerce', 
    //entities: [payment], 
    autoLoadEntities: true,
    synchronize: true,
  }), CartsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
