import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class DateRangeDto {
  @IsDate({ message: 'Is not valid Date' })
  @IsNotEmpty()
  @ApiProperty()
  from: Date;

  @IsDate({ message: 'Is not valid Date' })
  @IsNotEmpty()
  @ApiProperty()
  to: Date;
}
export class DateRangeDtoOptional {
  @IsDate({ message: 'Is not valid Date' })
  @IsOptional()
  @ApiProperty()
  from?: Date;

  @IsDate({ message: 'Is not valid Date' })
  @IsOptional()
  @ApiProperty()
  to?: Date;
}
