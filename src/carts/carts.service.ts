import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {

  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { userName, email, products } = createCartDto;
    const cart = this.cartRepository.create({ userName, email });

    await this.cartRepository.save(cart);

    const productEntities = products.map((productDto) => {
      const product = this.productRepository.create(productDto);
      product.cart = cart;
      return product;
    });

    await this.productRepository.save(productEntities);

    return this.cartRepository.findOne({ where: { id: cart.id }, relations: ['products'] });
  }


  async findCartByEmail(email: string): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { email },
      relations: ['products'],
    });
  }


  

  async remove(id: number): Promise<void> {
    await this.productRepository.delete({ cart: { id } });
    await this.cartRepository.delete(id);
  }
}


