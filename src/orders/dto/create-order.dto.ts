export class CreateOrderDto {
    email: string;
    userName: string;
    amount: number;
    deliveryAddress: string;
    products: { id: number; quantity: number }[];
  }