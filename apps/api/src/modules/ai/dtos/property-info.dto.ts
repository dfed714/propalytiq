import { IsString } from 'class-validator';

export class GetPropertyInfoDto {
  @IsString()
  url!: string;
}
