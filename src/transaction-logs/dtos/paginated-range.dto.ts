import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dtos/paginated.dto';
import { DateRangeDto } from '../../profit/dtos/date-range.dto';

export class PaginatedRangeDTO extends IntersectionType(
  PaginationDto,
  DateRangeDto,
) {}
