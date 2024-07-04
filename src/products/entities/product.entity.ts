import { Cart } from 'src/carts/entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ManyToMany, ManyToOne } from 'typeorm';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itle: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  category: string;


  @Column()
  instantDelivery: boolean;

  @ManyToOne(() => Cart, (cart) => cart.products)
  cart: Cart;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}