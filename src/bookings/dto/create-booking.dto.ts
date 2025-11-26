import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 3, description: 'ID de la habitación a reservar' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  roomId: number;

  @ApiProperty({ example: 'Nadia Viñabal' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  guestName: string;

  @ApiPropertyOptional({
    example: 'nadia@example.com',
    description: 'Email del huésped',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail()
  guestEmail?: string;

  @ApiPropertyOptional({ example: 2, description: 'Cantidad de huéspedes' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(1)
  guestsCount?: number;

  @ApiProperty({
    example: '2025-12-20T15:00:00Z',
    description: 'Fecha de check-in en formato ISO',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsDateString()
  checkIn: string;

  @ApiProperty({
    example: '2025-12-23T11:00:00Z',
    description: 'Fecha de check-out en formato ISO',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsDateString()
  checkOut: string;
}
