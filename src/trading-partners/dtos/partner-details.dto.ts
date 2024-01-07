import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartnerType } from '../../enums/UserTypes.enum';

export class PartnerDetailsDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsEmail({}, { message: 'Please provide valid Email' })
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsEnum(PartnerType, { message: 'Wrong type' })
  @ApiProperty({ enum: PartnerType })
  type: PartnerType;

  @IsString()
  @IsOptional()
  @ApiProperty()
  companyName?: string;
}
