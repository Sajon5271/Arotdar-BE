import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsNumber({}, { message: 'Invalid PageNumber' })
  @IsNotEmpty()
  @ApiProperty()
  pageNumber: number;

  @IsNumber({}, { message: 'Invalid PageSize' })
  @IsNotEmpty()
  @ApiProperty()
  pageSize: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  sortBy?: string;
}
