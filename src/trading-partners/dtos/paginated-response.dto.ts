import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { TradingPartner } from '../../schemas/trading-partners.schema';

export class PaginatedResults<T> {
  @ApiProperty()
  Results: T[];
  @ApiProperty()
  TotalPages: number;
  @ApiProperty()
  CurrentPage: number;
  @ApiProperty()
  TotalDataLength: number;
  @ApiProperty()
  PageSize: number;
}
