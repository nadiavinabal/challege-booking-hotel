import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { RoomsService } from 'src/rooms/rooms.service';
import { RoomDto } from 'src/rooms/dto/room.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly roomsService: RoomsService,
  ) {}

  //create reserva
  async create(dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    this.validateDates(checkIn, checkOut);

    const room = await this.validateRoom(dto.roomId);

    if (dto.guestsCount === undefined || dto.guestsCount === null) {
      throw new BadRequestException('guestsCount es obligatorio');
    }

    this.validateCapacity(room, dto.guestsCount);

    await this.ensureNoOverlap(dto.roomId, checkIn, checkOut);

    return this.saveBooking(dto, checkIn, checkOut);
  }

  //valida fecha
  private validateDates(checkIn: Date, checkOut: Date): void {
    if (checkIn >= checkOut) {
      throw new ConflictException('checkIn must be before checkOut');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new ConflictException(
        'La fecha de check-in no puede ser en el pasado.',
      );
    }
  }

  // valida habitacion
  private async validateRoom(roomId: number) {
    const room = await this.roomsService.findById(roomId);

    if (!room) {
      throw new NotFoundException(`La habitación con id=${roomId} no existe.`);
    }

    return room;
  }

  //valida capacidad
  private validateCapacity(room: RoomDto, guestsCount: number): void {
    const capacity = room.capacity ?? 0;

    if (guestsCount <= 0) {
      throw new BadRequestException(
        'El número de huéspedes debe ser mayor a 0.',
      );
    }

    if (guestsCount > capacity) {
      throw new BadRequestException('Supera la capacidad de la habitación.');
    }
  }

  //Validar solapamiento
  private async ensureNoOverlap(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<void> {
    const overlapping = await this.bookingRepo
      .createQueryBuilder('b')
      .where('b.roomId = :roomId', { roomId })
      .andWhere('b.checkIn < :checkOut AND :checkIn < b.checkOut', {
        checkIn,
        checkOut,
      })
      .getOne();

    if (overlapping) {
      this.logger.warn(
        `Reserva rechazada por solapamiento para roomId=${roomId}`,
      );
      throw new ConflictException(
        'La habitación ya tiene una reserva en esas fechas.',
      );
    }
  }

  //crea y guarda reserva
  private async saveBooking(
    dto: CreateBookingDto,
    checkIn: Date,
    checkOut: Date,
  ) {
    const booking = this.bookingRepo.create({
      ...dto,
      checkIn,
      checkOut,
    });

    const saved = await this.bookingRepo.save(booking);

    this.logger.log(`Reserva creada correctamente ID=${saved.id}`);

    return saved;
  }

  findAll(params: {
    from?: string;
    to?: string;
    hotelId?: number;
    roomId?: number;
  }) {
    const qb = this.bookingRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.room', 'room')
      .leftJoinAndSelect('room.hotel', 'hotel');

    if (params.from) qb.andWhere('b.checkIn >= :from', { from: params.from });
    if (params.to) qb.andWhere('b.checkOut <= :to', { to: params.to });
    if (params.hotelId)
      qb.andWhere('hotel.id = :hotelId', { hotelId: params.hotelId });
    if (params.roomId)
      qb.andWhere('room.id = :roomId', { roomId: params.roomId });

    return qb.getMany();
  }

  async findOne(id: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['room', 'room.hotel'],
    });

    if (!booking) {
      throw new NotFoundException(`No se encontró la reserva con id= ${id}`);
    }

    return booking;
  }
}
