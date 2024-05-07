import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class DateRangeDto {
  @IsDateString({}, { message: 'Is not valid Date' })
  @IsNotEmpty()
  @ApiProperty()
  from: Date;

  @IsDateString({}, { message: 'Is not valid Date' })
  @IsNotEmpty()
  @ApiProperty()
  to: Date;
}

export class DateRangeDtoOptional {
  @IsDateString({}, { message: 'Is not valid Date' })
  @IsOptional()
  @ApiProperty()
  from?: Date;

  @IsDateString({}, { message: 'Is not valid Date' })
  @IsOptional()
  @ApiProperty()
  to?: Date;
}
