import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dtos/paginated.dto';
import { DateRangeDto } from '../../profit/dtos/date-range.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class PartnerId {
  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  partnerId?: string;
}

export class PaginatedRangeDTO extends IntersectionType(
  PaginationDto,
  PartialType(DateRangeDto),
  PartnerId,
) {}
