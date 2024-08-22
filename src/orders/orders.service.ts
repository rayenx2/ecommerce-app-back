import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from './entities/order-product';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderProduct)
    private orderProductsRepository: Repository<OrderProduct>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { email, userName, products, deliveryAddress } = createOrderDto;
    let totalAmount = 0;

    // Calculate the total amount
    for (const { id, quantity } of products) {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      totalAmount += product.price * quantity;
    }

    const order = this.ordersRepository.create({
      email,
      userName,
      amount: totalAmount,
      deliveryAddress,
      status: 'pending', // Set initial status as 'pending'
    });

    await this.ordersRepository.save(order);

    for (const { id, quantity } of products) {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      const orderProduct = this.orderProductsRepository.create({
        order,
        product,
        quantity,
      });

      await this.orderProductsRepository.save(orderProduct);
    }

    return this.ordersRepository.findOne({
      where: { id: order.id },
      relations: ['orderProducts', 'orderProducts.product'],
    });
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['orderProducts', 'orderProducts.product'],
    });
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
  async updateProductQuantity(orderId: number, productId: number, updateOrderProductDto: UpdateOrderProductDto): Promise<OrderProduct> {
    const { quantity } = updateOrderProductDto;
  
    // Validate quantity
    if (typeof quantity !== 'number' || isNaN(quantity) || quantity < 0) {
      throw new BadRequestException('Invalid quantity value');
    }
  
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['orderProducts', 'orderProducts.product'], // Ensure 'product' relation is included
    });
  
    console.log('Order:', JSON.stringify(order, null, 2)); // Print full order details
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  
    order.orderProducts.forEach(op => {
      console.log('OrderProduct:', JSON.stringify(op, null, 2), 'Product ID:', op.product?.id);
    });
  
    // Ensure product is present and ID matches
    const orderProduct = order.orderProducts.find(op => op.product?.id == productId);
    
    console.log('Matching OrderProduct:', JSON.stringify(orderProduct, null, 2));
  
    if (!orderProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found in Order ${orderId}`);
    }
  
    orderProduct.quantity = quantity;
    
    console.log('Updated quantity:', quantity);
    return this.orderProductsRepository.save(orderProduct);
  }
  
  

async updateProductInOrder(orderId: number, oldProductId: number, newProductId: number): Promise<Order> {
  const order = await this.ordersRepository.findOne({
    where: { id: orderId },
    relations: ['orderProducts', 'orderProducts.product'],
  });

  if (!order) {
    throw new NotFoundException(`Order with ID ${orderId} not found`);
  }

  // Find the old OrderProduct and the new Product
  const oldOrderProduct = order.orderProducts.find(op => op.product.id == oldProductId);
  if (!oldOrderProduct) {
    throw new NotFoundException(`Product with ID ${oldProductId} not found in Order ${orderId}`);
  }

  const newProduct = await this.productRepository.findOneBy({ id: newProductId });
  if (!newProduct) {
    throw new NotFoundException(`Product with ID ${newProductId} not found`);
  }

  // Update the product in the existing OrderProduct entry
  oldOrderProduct.product = newProduct;

  // Recalculate the total amount manually
  let newTotalAmount = 0;
  for (const orderProduct of order.orderProducts) {
    newTotalAmount += orderProduct.product.price * orderProduct.quantity;
  }

  // Update the order amount
  order.amount = newTotalAmount;

  // Save the updated OrderProduct and Order
  await this.orderProductsRepository.save(oldOrderProduct);
  await this.ordersRepository.save(order);

  return this.ordersRepository.findOne({
    where: { id: orderId },
    relations: ['orderProducts', 'orderProducts.product'],
  });
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

  async deleteOrderProduct(orderId: number, productId: number): Promise<Order> {
    // Fetch the order with related products
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['orderProducts', 'orderProducts.product'],
    });
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  
    // Find and remove the OrderProduct entry for the given productId
    const orderProduct = order.orderProducts.find(op => op.product.id == productId);
  
    if (!orderProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found in Order ${orderId}`);
    }
  
    // Remove the OrderProduct entry from the database
    await this.orderProductsRepository.remove(orderProduct);
  
    // Fetch the updated order with the remaining products
    const updatedOrder = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['orderProducts', 'orderProducts.product'],
    });
  
    if (!updatedOrder) {
      throw new NotFoundException(`Updated order with ID ${orderId} not found`);
    }
  
    // Recalculate the total amount correctly
    let newTotalAmount = 0;
    for (const op of updatedOrder.orderProducts) {
      newTotalAmount += op.product.price * op.quantity;
    }
  
    console.log(`New total amount calculated: ${newTotalAmount}`); // Debugging statement
  
    // Update the order amount
    updatedOrder.amount = newTotalAmount;
  
    // Save the updated Order
    const savedOrder = await this.ordersRepository.save(updatedOrder);
  
    console.log('Order saved successfully:', savedOrder); // Debugging statement
  
    // Return the updated Order with relations
    return savedOrder;
  }
  
  
  
}