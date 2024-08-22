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
          SELECT o.id, SUM(p.price * op.quantity) AS order_total
          FROM "order_product" op
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

  async getSumOfAllOrdersByWeek(): Promise<any> {
    try {
      const rawQuery = `
        SELECT 
          DATE_TRUNC('day', o."createdAt") AS date,
          SUM(p.price * op.quantity) AS totalSum
        FROM "order_product" op
        INNER JOIN "product" p ON op."productId" = p.id
        INNER JOIN "order" o ON op."orderId" = o.id
        WHERE o."createdAt" >= NOW() - INTERVAL '1 week'
        GROUP BY DATE_TRUNC('day', o."createdAt")
        ORDER BY date;
      `;
      
      const result = await this.orderRepository.query(rawQuery);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async getSumOfAllOrdersByMonth(): Promise<any> {
    try {
      const rawQuery = `
        SELECT 
          DATE_TRUNC('day', o."createdAt") AS date,
          SUM(p.price * op.quantity) AS totalSum
        FROM "order_product" op
        INNER JOIN "product" p ON op."productId" = p.id
        INNER JOIN "order" o ON op."orderId" = o.id
        WHERE o."createdAt" >= NOW() - INTERVAL '1 month'
        GROUP BY DATE_TRUNC('day', o."createdAt")
        ORDER BY date;
      `;
      
      const result = await this.orderRepository.query(rawQuery);
      return result;
    } catch (error) {
      throw error;
    }
  }
  

  async getProductsOrderedByMostSold(): Promise<any[]> {
    try {
      const rawQuery = `
        SELECT pr.*, SUM(op.quantity) as sales_count
        FROM "order_product" op
        INNER JOIN "product" pr ON op."productId" = pr.id
        GROUP BY pr.id
        ORDER BY sales_count DESC
      `;

      const result = await this.productRepository.query(rawQuery);
      return result;
    } catch (error) {
      throw error;
    }
  }


  async getProductsOrderedByMostSoldByWeek(): Promise<any[]> {
    try {
      const rawQuery = `
        SELECT pr.*, SUM(op.quantity) as sales_count
        FROM "order_product" op
        INNER JOIN "product" pr ON op."productId" = pr.id
        INNER JOIN "order" o ON op."orderId" = o.id
        WHERE o."createdAt" >= NOW() - INTERVAL '7 days'
        GROUP BY pr.id
        ORDER BY sales_count DESC
      `;

      const result = await this.productRepository.query(rawQuery);
      return result;
    } catch (error) {
      throw error;
    }
  }


  async getProductsOrderedByMostSoldByMonth(): Promise<any[]> {
    try {
      const rawQuery = `
        SELECT pr.*, SUM(op.quantity) as sales_count
        FROM "order_product" op
        INNER JOIN "product" pr ON op."productId" = pr.id
        INNER JOIN "order" o ON op."orderId" = o.id
        WHERE o."createdAt" >= NOW() - INTERVAL '1 month'
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
          SUM(op.quantity) as sales_count
        FROM 
          "order_product" op
          INNER JOIN "product" pr ON op."productId" = pr.id
          INNER JOIN "category" c ON pr."categoryId" = c.id
        GROUP BY 
          pr."categoryId", c."name"
        ORDER BY 
          sales_count DESC;
      `;

      const result = await this.productRepository.query(rawQuery);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
