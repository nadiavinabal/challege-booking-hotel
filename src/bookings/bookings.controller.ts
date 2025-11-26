import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKey } from 'src/auth/api-key/api-key.decorator';

@ApiTags('Bookings')
@ApiSecurity('apiKeyAuth')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiKey()
  @Post()
  @ApiOperation({ summary: 'Crear una reserva' })
  @ApiResponse({ status: 201, description: 'Reserva creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Room no encontrada' })
  @ApiResponse({ status: 409, description: 'Reserva solapada' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @ApiKey()
  @Get()
  @ApiOperation({ summary: 'Listar reservas con filtros' })
  @ApiQuery({ name: 'from', required: false, example: '2025-01-01' })
  @ApiQuery({ name: 'to', required: false, example: '2025-12-31' })
  @ApiQuery({ name: 'hotelId', required: false, example: 1 })
  @ApiQuery({ name: 'roomId', required: false, example: 3 })
  @ApiResponse({ status: 200 })
  findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('hotelId') hotelId?: number,
    @Query('roomId') roomId?: number,
  ) {
    return this.bookingsService.findAll({ from, to, hotelId, roomId });
  }

  @ApiKey()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una reserva' })
  @ApiParam({ name: 'id', example: 4 })
  @ApiResponse({ status: 200 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }
}
