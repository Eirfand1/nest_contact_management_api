export class ResponseAddressDto {
    id: number;
    street?: string;
    city?: string;
    province?: string;
    country: string;
    postal_code: string;
}