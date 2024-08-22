import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  
  @Get('sum-of-all-orders')
  async getSumOfAllOrders() {
    return this.statisticsService.getSumOfAllOrders();
  }

  @Get('sum-by-week')
  async getSumOfAllOrdersByWeek() {
    return this.statisticsService.getSumOfAllOrdersByWeek();
  }

  @Get('sum-by-month')
  async getSumOfAllOrdersByMonth() {
    return this.statisticsService.getSumOfAllOrdersByMonth();
  }

  @Get('products-ordered-by-most-sold')
  async getProductsOrderedByMostSold() {
    return this.statisticsService.getProductsOrderedByMostSold();
  }

  @Get('products-ordered-by-most-sold-by-week')
  async getProductsOrderedByMostSoldByWeek() {
    return this.statisticsService.getProductsOrderedByMostSoldByWeek();
  }

  @Get('products-ordered-by-most-sold-by-month')
  async getProductsOrderedByMostSoldByMonth() {
    return this.statisticsService.getProductsOrderedByMostSoldByMonth();
  }

  @Get('categories-ordered-by-most-sold')
  async getCategoriesOrderedByMostSold() {
    return this.statisticsService.getCategoriesOrderedByMostSold();
  }

  
}
