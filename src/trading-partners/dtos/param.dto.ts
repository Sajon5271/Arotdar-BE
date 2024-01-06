import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ParamDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
