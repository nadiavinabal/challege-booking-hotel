import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { HotelsService } from 'src/hotels/hotels.service';
import { NotFoundException } from '@nestjs/common';

describe('RoomsService', () => {
  let service: RoomsService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockHotelsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(Room),
          useValue: mockRepo,
        },
        {
          provide: HotelsService,
          useValue: mockHotelsService,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);

    jest.clearAllMocks();
  });

  // ---------------- CREATE -------------------
  describe('create', () => {
    const dto = {
      name: 'Habitación 101',
      hotelId: 1,
      capacity: 3,
      roomType: 'doble',
    };

    it('debería lanzar error si el hotel no existe', async () => {
      mockHotelsService.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('debería crear una habitación correctamente', async () => {
      mockHotelsService.findById.mockResolvedValue({ id: 1 });
      mockRepo.create.mockReturnValue({ id: 10 });
      mockRepo.save.mockResolvedValue({ id: 10 });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 10 });
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  // ---------------- FIND BY HOTEL -------------------
  describe('findByHotel', () => {
    it('debería devolver las habitaciones de un hotel', async () => {
      const rooms = [{ id: 1 }, { id: 2 }];
      mockRepo.find.mockResolvedValue(rooms);

      const result = await service.findByHotel(5);

      expect(result).toEqual(rooms);
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { hotelId: 5 },
      });
    });
  });

  // ---------------- FIND BY ID -------------------
  describe('findById', () => {
    it('debería devolver una habitación existente', async () => {
      const room = { id: 1 };
      mockRepo.findOne.mockResolvedValue(room);

      const result = await service.findById(1);

      expect(result).toEqual(room);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería lanzar error si NO existe la habitación', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
