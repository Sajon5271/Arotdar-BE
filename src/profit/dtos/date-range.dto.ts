import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

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
