import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsArray } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    status: string;
 
}
