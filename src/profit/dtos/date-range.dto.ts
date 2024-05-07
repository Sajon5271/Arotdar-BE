import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsValidDate } from '../../decorators/DateValidator.decorator';

export class DateRangeDto {
  @Validate(IsValidDate)
  @IsNotEmpty()
  @ApiProperty()
  from: Date;

  @Validate(IsValidDate)
  @IsNotEmpty()
  @ApiProperty()
  to: Date;
}

export class DateRangeDtoOptional {
  @Validate(IsValidDate)
  @IsOptional()
  @ApiProperty()
  from?: Date;

  @Validate(IsValidDate)
  @IsOptional()
  @ApiProperty()
  to?: Date;
}
