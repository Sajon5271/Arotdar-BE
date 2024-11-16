import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResults<T> {
  @ApiProperty()
  Results: T[];
  @ApiProperty()
  TotalPages: number;
  @ApiProperty()
  CurrentPage: number;
  @ApiProperty()
  TotalDataLength: number;
  @ApiProperty()
  PageSize: number;
}
