import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber } from 'class-validator';

export class UpdateDueOfPartners {
  @ApiProperty()
  @IsMongoId()
  partnerId: string;

  @ApiProperty()
  @IsNumber()
  dueChange: number;
}
