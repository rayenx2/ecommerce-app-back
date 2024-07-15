import { Product } from "src/products/entities/product.entity";
import {Entity ,Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName : string;

    @Column()
    email : string;

    @OneToMany(() => Product, (Product) => Product.cart)
    products: Product[];
}
