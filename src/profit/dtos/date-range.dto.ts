import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsValidDate } from '../../decorators/DateValidator.decorator';

export class DateRangeDto {
  @Validate(IsValidDate)
  @IsNotEmpty()
  @ApiProperty()
  from: string;

  @Validate(IsValidDate)
  @IsNotEmpty()
  @ApiProperty()
  to: string;
}

export class DateRangeDtoOptional {
  @Validate(IsValidDate)
  @IsOptional()
  @ApiProperty()
  from?: string;

  @Validate(IsValidDate)
  @IsOptional()
  @ApiProperty()
  to?: string;
}
