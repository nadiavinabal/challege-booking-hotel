import { Test, TestingModule } from '@nestjs/testing';
import { HotelsService } from './hotels.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { NotFoundException } from '@nestjs/common';

describe('HotelsService', () => {
  let service: HotelsService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelsService,
        {
          provide: getRepositoryToken(Hotel),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<HotelsService>(HotelsService);

    jest.clearAllMocks();
  });

  // ---------------- CREATE -------------------
  describe('create', () => {
    const dto = {
      name: 'Hotel Test',
      address: 'Calle Falsa 123',
      description: 'Un buen hotel',
    };

    it('debería crear un hotel correctamente', async () => {
      mockRepo.create.mockReturnValue({ id: 1 });
      mockRepo.save.mockResolvedValue({ id: 1 });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1 });
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  // ---------------- FIND ALL -------------------
  describe('findAll', () => {
    it('debería devolver todos los hoteles', async () => {
      const hotels = [{ id: 1 }, { id: 2 }];
      mockRepo.find.mockResolvedValue(hotels);

      const result = await service.findAll();

      expect(result).toEqual(hotels);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  // ---------------- FIND BY ID -------------------
  describe('findById', () => {
    it('debería devolver un hotel existente', async () => {
      const hotel = { id: 1 };
      mockRepo.findOne.mockResolvedValue(hotel);

      const result = await service.findById(1);

      expect(result).toEqual(hotel);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería lanzar error si NO existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
