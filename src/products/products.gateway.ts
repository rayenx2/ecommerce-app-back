import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@WebSocketGateway()
export class ProductsGateway {
  constructor(private readonly productsService: ProductsService) {}

  @SubscribeMessage('createProduct')
  create(@MessageBody() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @SubscribeMessage('findAllProducts')
  findAll() {
    return this.productsService.findAll();
  }

  @SubscribeMessage('findOneProduct')
  findOne(@MessageBody() id: number) {
    return this.productsService.findOne(id);
  }

  @SubscribeMessage('updateProduct')
  update(@MessageBody() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @SubscribeMessage('removeProduct')
  remove(@MessageBody() id: number) {
    return this.productsService.remove(id);
  }
}
