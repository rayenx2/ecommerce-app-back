import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getSumOfAllOrders(): Promise<any> {
    try {
      const rawQuery = `
        SELECT SUM(order_total) AS totalSum
        FROM (
          SELECT o.id, SUM(p.price) AS order_total
          FROM "order_products_product" op
          INNER JOIN "product" p ON op."productId" = p.id
          INNER JOIN "order" o ON op."orderId" = o.id
          GROUP BY o.id
        ) AS order_totals;
      `;
      
      const result = await this.orderRepository.query(rawQuery);
      return result[0]; // Assuming there's only one row returned
    } catch (error) {
      throw error;
    }
  }



  async getProductsOrderedByMostSold(): Promise<any[]> {
    try {
      const rawQuery = `
        SELECT pr.*, COUNT(op."productId") as sales_count
        FROM public.order_products_product op 
        INNER JOIN public.product pr 
        ON op."productId" = pr.id
        GROUP BY pr.id
        ORDER BY sales_count DESC
      `;

      const result = await this.productRepository.query(rawQuery);
      return result;
    } catch (error) {
      throw error;
    }
  }


  async getCategoriesOrderedByMostSold(): Promise<any> {
    try {
      const rawQuery = `
        SELECT 
    pr."categoryId",
    c."name" as category_name,
    COUNT(op."productId") as sales_count
FROM 
    public.order_products_product op
    INNER JOIN public.product pr ON op."productId" = pr.id
    INNER JOIN public.category c ON pr."categoryId" = c.id
GROUP BY 
    pr."categoryId", c."name"
ORDER BY 
    sales_count DESC;

       
      `;

      const result = await this.productRepository.query(rawQuery);
      return result;
    } catch (error) {
      return error;
    }
  }
}
