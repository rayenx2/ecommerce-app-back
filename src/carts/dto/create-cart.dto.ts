import { CreateProductDto } from "src/products/dto/create-product.dto";
export class CreateCartDto {
     userName: string;
     email: string;
     products: CreateProductDto[];
}
