import { Body, Controller, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles/roles.decorator';
import { ProfitService } from './profit.service';
import {
  GenericArrayOfNumberResponse,
  GenericArrayResponse,
} from '../swagger/GenericResponseDecorator';
import { DateRangeDto } from './dtos/date-range.dto';

@ApiTags('Profits')
@ApiCookieAuth()
@Controller('profit')
@Roles(['admin'])
export class ProfitController {
  constructor(private profitService: ProfitService) {}

  @Post('year-view')
  @GenericArrayOfNumberResponse()
  getProfitForAYear(@Body() dateRange: DateRangeDto) {
    return this.profitService.getProfitsForYearView(dateRange);
  }
  @Post('custom-range')
  @GenericArrayOfNumberResponse()
  getProfitForRange(@Body() dateRange: DateRangeDto) {
    return this.profitService.getProfitForCustomRange(dateRange);
  }
}
