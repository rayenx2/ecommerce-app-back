import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

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

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
