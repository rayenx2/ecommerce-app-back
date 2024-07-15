import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { email, userName, amount, productIds } = createOrderDto;

    // Fetch products by IDs
    const products = await this.productRepository.findByIds(productIds || []);

    // Create and save the order
    const order = this.ordersRepository.create({
      email,
      userName,
      amount,
      products,
    });

    return this.ordersRepository.save(order);
  
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['products'] });
  }

}
