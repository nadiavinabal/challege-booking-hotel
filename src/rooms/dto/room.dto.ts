import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RoomDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  capacity?: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  roomType?: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  hotelId: number;
}
