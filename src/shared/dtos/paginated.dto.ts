import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNumberOrString } from '../check-number-or-string.validator';

export class PaginationDto {
  @Validate(IsNumberOrString, { message: 'Invalid PageNumber' })
  @IsNotEmpty()
  @ApiProperty()
  pageNumber: number;

  @Validate(IsNumberOrString, { message: 'Invalid PageSize' })
  @IsNotEmpty()
  @ApiProperty()
  pageSize: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  sortBy?: string;
}
