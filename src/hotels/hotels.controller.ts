import { Body, Controller, Get, Post } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { Hotel } from './entities/hotel.entity';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { ApiKey } from 'src/auth/api-key/api-key.decorator';

@ApiTags('Hotel')
@ApiSecurity('apiKeyAuth')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @ApiKey()
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo hotel' })
  @ApiResponse({ status: 201, description: 'Hotel creado correctamente' })
  create(@Body() dto: CreateHotelDto) {
    return this.hotelsService.create(dto);
  }

  @ApiKey()
  @Get()
  @ApiOperation({ summary: 'Listar todos los hoteles' })
  @ApiResponse({ status: 200 })
  getAll(): Promise<Hotel[]> {
    return this.hotelsService.findAll();
  }
}
