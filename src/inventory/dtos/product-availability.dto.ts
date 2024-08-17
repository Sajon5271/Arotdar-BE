// import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductAvailablityDto {
  @ApiPropertyOptional()
  partnerId?: string;

  @ApiPropertyOptional()
  productId?: string;
}
