import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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
      status: 'pending', // Set initial status as 'pending'
    });

    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['products'] });
  }

  async updateStatus(id: number, UpdateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({id});

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    console.log(order);
    console.log(order.status);
    order.status = UpdateOrderDto.status;
    return this.ordersRepository.save(order);
  }

  async deleteOrder(id: number): Promise<void> {
    try {
      const order = await this.ordersRepository.findOneBy({ id });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.ordersRepository.remove(order);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to delete the order');
      }
    }
  }

  async getOrdersByUserName(userName: string): Promise<Order[]> {
    const orders = await this.ordersRepository.find({ where: { userName: Like(`%${userName}%`) }, relations: ['products'] });
    console.log(orders);
    if (!orders.length) {
      throw new NotFoundException(`No orders found with user name containing "${userName}"`);
    }
    return orders;
  }


  async getOrdersByStatus(status: string): Promise<Order[]> {
    const orders = await this.ordersRepository.find({ where: { status: status}, relations: ['products'] });
    console.log(orders);
    if (!orders.length) {
      throw new NotFoundException(`No orders found with status containing "${status}"`);
    }
    return orders;
  }


  async getOrdersByAmount(amount: number): Promise<Order[]> {
    const orders = await this.ordersRepository.find({ 
      where: { amount }, 
      relations: ['products']
    });
    console.log('getOrdersByAmount:', orders);
    if (!orders.length) {
      throw new NotFoundException(`No orders found with amount ${amount}`);
    }
    return orders;
  }
}