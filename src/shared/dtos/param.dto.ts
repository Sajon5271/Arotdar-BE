import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ParamDto {
  @IsMongoId({ message: 'Invalid Id' })
  @IsNotEmpty()
  id: string;
}
