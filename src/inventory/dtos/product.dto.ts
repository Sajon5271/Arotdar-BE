import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  productName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productDescription?: string;

  @ApiProperty()
  // @Min(0)
  @IsInt({ message: 'Quantity must be a whole number' })
  quantity: number;

  @ApiProperty()
  @Min(0, { message: 'Price cannot be less than 0' })
  @IsNumber({}, { message: 'Price must be a number' })
  currentPricePerUnit: number;
}
