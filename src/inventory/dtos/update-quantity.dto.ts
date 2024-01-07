import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class UpdateQuantityDto {
  @ApiProperty()
  // @Min(0)
  @IsInt({ message: 'Quantity must be a whole number' })
  quantity: number;

  @ApiProperty()
  @IsBoolean({ message: 'Must confirm if selling or buying' })
  isSelling: boolean;
}
