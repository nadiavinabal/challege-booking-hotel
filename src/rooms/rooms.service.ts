import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { HotelsService } from 'src/hotels/hotels.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    private readonly hotelsService: HotelsService,
  ) {}

  async create(dto: CreateRoomDto) {
    const hotel = await this.hotelsService.findById(dto.hotelId);

    if (!hotel) {
      throw new NotFoundException(`No existe el hotel con id=${dto.hotelId}`);
    }
    const room = this.roomRepo.create(dto);
    return this.roomRepo.save(room);
  }

  findByHotel(hotelId: number) {
    return this.roomRepo.find({
      where: { hotelId },
    });
  }

  async findById(id: number): Promise<Room> {
    const room = await this.roomRepo.findOne({ where: { id } });

    if (!room) {
      throw new NotFoundException(`Room with id=${id} not found`);
    }

    return room;
  }
}
