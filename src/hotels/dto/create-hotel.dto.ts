import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateHotelDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  @ApiProperty({ example: 'Hotel Jujuy' })
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  @ApiProperty({ example: 'San Salvador de Jujuy' })
  city?: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  @ApiProperty({ example: 'Av. 19 de Abril 1234', required: false })
  address?: string;
}
