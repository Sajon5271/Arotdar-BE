import { Expose } from 'class-transformer';

export class UserResponseDTO {
  @Expose()
  _id: string;
  @Expose()
  email: string;
  @Expose()
  name: string;
}
