export interface GetPropertyInfoDto {
  url: string;
}

export interface PropertyInfoDto {
  property_address: string;
  purchase_price?: number | null;
  rental_price_per_month?: number | null;
  number_of_bedrooms?: number | null;
  number_of_bathrooms?: number | null;
  property_type?: string | null;
  property_description?: string | null;
}
