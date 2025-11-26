import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Suite Deluxe' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  hotelId: number;

  @ApiPropertyOptional({ example: 4 })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  capacity?: number;

  @ApiPropertyOptional({ example: 'double' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  roomType?: string;
}
