import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Repository } from 'typeorm';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  create(dto: CreateHotelDto) {
    const hotel = this.hotelRepository.create(dto);
    return this.hotelRepository.save(hotel);
  }
  findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find();
  }

  async findById(id: number) {
    const hotel = await this.hotelRepository.findOne({ where: { id } });

    if (!hotel) {
      throw new NotFoundException(`No existe el hotel con id=${id}`);
    }

    return hotel;
  }
}
