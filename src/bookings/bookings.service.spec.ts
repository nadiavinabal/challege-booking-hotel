import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { RoomsService } from '../rooms/rooms.service';
describe('BookingsService', () => {
  let service: BookingsService;

  // Mock del repositorio
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    }),
  };

  const mockRoomsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepo,
        },
        {
          provide: RoomsService,
          useValue: mockRoomsService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);

    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('debería retornar una reserva existente', async () => {
      const booking = { id: 1 };
      mockRepo.findOne.mockResolvedValue(booking);

      const result = await service.findOne(1);

      expect(result).toEqual(booking);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['room', 'room.hotel'],
      });
    });

    it('debería lanzar error si no existe la reserva', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto = {
      roomId: 1,
      guestsCount: 2,
      checkIn: '2099-01-10',
      checkOut: '2099-01-15',
      guestName: 'John Doe',
    };

    it('debería lanzar error si las fechas son inválidas', async () => {
      const invalidDto = {
        ...dto,
        checkOut: '2099-01-05',
      };

      await expect(service.create(invalidDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('debería lanzar error si guestsCount es nulo o undefined', async () => {
      mockRoomsService.findById.mockResolvedValue({
        id: 1,
        capacity: 4,
      });
      const invalidDto = { ...dto, guestsCount: null };

      await expect(service.create(invalidDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar error si la habitación NO existe', async () => {
      mockRoomsService.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error si excede la capacidad', async () => {
      mockRoomsService.findById.mockResolvedValue({
        id: 1,
        capacity: 1,
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar error si hay reserva solapada', async () => {
      mockRoomsService.findById.mockResolvedValue({
        id: 1,
        capacity: 5,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      mockRepo.createQueryBuilder().getOne.mockResolvedValue({
        id: 99,
      });
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('debería crear una reserva correctamente', async () => {
      mockRoomsService.findById.mockResolvedValue({
        id: 1,
        capacity: 5,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      mockRepo.createQueryBuilder().getOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({ id: 10 });
      mockRepo.save.mockResolvedValue({ id: 10 });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 10 });
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería llamar correctamente al query builder con filtros', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const qb = mockRepo.createQueryBuilder();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      qb.getMany.mockResolvedValue([{ id: 1 }]);

      const params = {
        from: '2099-01-01',
        to: '2099-01-20',
        hotelId: 5,
        roomId: 10,
      };

      const result = await service.findAll(params);

      expect(result).toEqual([{ id: 1 }]);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(qb.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(qb.andWhere).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(qb.getMany).toHaveBeenCalled();
    });
  });
});
