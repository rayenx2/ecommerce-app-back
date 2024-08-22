import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, CreateDateColumn } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from './order-product';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  userName: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  deliveryAddress: string;
  
  @Column({ default: 'pending' }) // Default status is 'pending'
  status: string;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts: OrderProduct[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  
}
