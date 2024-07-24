import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  
  @Get('sum-of-all-orders')
  async getSumOfAllOrders() {
    return this.statisticsService.getSumOfAllOrders();
  }

  @Get('products-ordered-by-most-sold')
  async getProductsOrderedByMostSold() {
    return this.statisticsService.getProductsOrderedByMostSold();
  }

  @Get('categories-ordered-by-most-sold')
  async getCategoriesOrderedByMostSold() {
    return this.statisticsService.getCategoriesOrderedByMostSold();
  }

  
}
