import { Test, TestingModule } from '@nestjs/testing';
import { ProductsGateway } from './products.gateway';
import { ProductsService } from './products.service';

describe('ProductsGateway', () => {
  let gateway: ProductsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsGateway, ProductsService],
    }).compile();

    gateway = module.get<ProductsGateway>(ProductsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
