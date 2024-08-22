import { Controller, Post, Body, Get , Patch , Delete , Param, NotFoundException, BadRequestException} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  // @Get('user')
  // async getOrdersByUserName(@Param('userName') userName: string): Promise<Order[]> {
  //   return this.ordersService.getOrdersByUserName(userName);
  // }

  @Get('user/:userName')
  async getOrdersByUserName(@Param('userName') userName: string): Promise<Order[]> {
    console.log(userName);
    if (!userName) {
      throw new NotFoundException('userName parameter is required');
    }
    return this.ordersService.getOrdersByUserName(userName);
  }

  @Get('status/:status')
  async getOrdersByStatus(@Param('status') status: string): Promise<Order[]> {
    console.log(status);
    if (!status) {
      throw new NotFoundException('status parameter is required');
    }
    return this.ordersService.getOrdersByStatus(status);
  }

  @Get('amount/:amount')
  async getOrdersByAmount(@Param('amount') amount: string): Promise<Order[]> {
    const parsedAmount = parseInt(amount);
    console.log('Received amount:', amount);
    if (isNaN(parsedAmount)) {
      throw new NotFoundException('amount parameter must be a number');
    }
    return this.ordersService.getOrdersByAmount(parsedAmount);
  }


  @Patch(':id/status')
  async updateStatus(@Param('id') id: number, @Body() UpdateOrderDto : UpdateOrderDto): Promise<Order> {
    const updatedOrderStatus =await this.ordersService.updateStatus(id, UpdateOrderDto);
    return updatedOrderStatus
  }



  @Patch(':orderId/product/:productId/quantity')
  async updateProductQuantity(
    @Param('orderId') orderId: number,
    @Param('productId') productId: number,
    @Body() updateOrderProductDto: UpdateOrderProductDto
  ): Promise<OrderProduct> {
    console.log( orderId, productId)
    return this.ordersService.updateProductQuantity(orderId, productId, updateOrderProductDto);
  }


  @Patch(':id/product')
  async updateProductInOrder(
    @Param('id') orderId: number,
    @Body() body: { oldProductId: number, newProductId: number }
  ): Promise<Order> {
    const { oldProductId, newProductId } = body;

    if (!oldProductId || !newProductId) {
      throw new BadRequestException('Both oldProductId and newProductId are required');
    }

    return this.ordersService.updateProductInOrder(orderId, oldProductId, newProductId);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string): Promise<void> {
    return this.ordersService.deleteOrder(+id);
  }

  @Delete(':orderId/products/:productId')
  async deleteOrderProduct(
    @Param('orderId') orderId: number,
    @Param('productId') productId: number
  ): Promise<Order> {
    return this.ordersService.deleteOrderProduct(orderId, productId);
  }
  

  }