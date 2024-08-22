import { IsNumber } from 'class-validator';

export class UpdateOrderProductDto {

    @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  oldProductId : number;

  newProductId : number;


}