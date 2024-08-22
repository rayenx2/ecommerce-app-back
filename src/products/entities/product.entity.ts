import { Cart } from 'src/carts/entities/cart.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OrderProduct } from '../../orders/entities/order-product';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
  
  @Column({ nullable: true })
  instantDelivery: boolean;

  @ManyToOne(() => Cart, (cart) => cart.products)
  cart: Cart;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];

}
