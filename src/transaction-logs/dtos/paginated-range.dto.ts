import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { DateRangeDtoOptional } from '../../profit/dtos/date-range.dto';
import { PaginationDto } from '../../shared/dtos/paginated.dto';

export class PartnerId {
  @IsOptional()
  @IsMongoId()
  @ApiProperty()
  partnerId?: string;
}

export class PaginatedRangeDTO extends IntersectionType(
  PaginationDto,
  DateRangeDtoOptional,
  PartnerId,
) {}
