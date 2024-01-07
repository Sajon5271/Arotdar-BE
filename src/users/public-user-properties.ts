import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class PublicUserProperties {
  @Expose()
  @Transform((params) => params.obj._id)
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  roles: string[];
}
