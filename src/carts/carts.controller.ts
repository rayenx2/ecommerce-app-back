import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }


  @Get()
  findCartByEmail(@Query('email') email: string) {
    return this.cartsService.findCartByEmail(email);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}
