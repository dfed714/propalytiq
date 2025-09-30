import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPropertyInfoDto {
  @IsString()
  url!: string;
}

export class PropertyInfoDto {
  @IsOptional()
  @IsString()
  property_address: string | null = null;

  @IsOptional()
  @Type(() => Number) // coerces "450000" -> 450000
  @IsNumber({ allowNaN: false, allowInfinity: false })
  purchase_price: number | null = null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  rental_price_per_month: number | null = null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  number_of_bedrooms: number | null = null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  number_of_bathrooms: number | null = null;

  @IsOptional()
  @IsString()
  property_type: string | null = null;

  @IsOptional()
  @IsString()
  property_description: string | null = null;
}
