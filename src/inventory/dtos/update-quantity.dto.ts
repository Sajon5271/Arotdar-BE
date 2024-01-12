import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateQuantityDto {
  @ApiProperty()
  // @Min(0)
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;

  @ApiProperty()
  @IsBoolean({ message: 'Must confirm if selling or buying' })
  isSelling: boolean;
}
