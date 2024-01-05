import { Expose } from 'class-transformer';

export class PublicUserProperties {
  @Expose()
  _id: string;
  @Expose()
  email: string;
  @Expose()
  name: string;
  @Expose()
  roles: string[];
}
