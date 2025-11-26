import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKey } from 'src/auth/api-key/api-key.decorator';

@ApiTags('Rooms')
@ApiSecurity('apiKeyAuth')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiKey()
  @Post()
  @ApiOperation({ summary: 'Crear una habitación' })
  @ApiResponse({ status: 201, description: 'Habitación creada' })
  @ApiResponse({ status: 404, description: 'El hotel no existe' })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @ApiKey()
  @Get('/hotel/:hotelId')
  @ApiOperation({ summary: 'Listar habitaciones de un hotel' })
  @ApiParam({ name: 'hotelId', example: 1 })
  @ApiResponse({ status: 200 })
  findByHotel(@Param('hotelId', ParseIntPipe) hotelId: number) {
    return this.roomsService.findByHotel(hotelId);
  }
}
