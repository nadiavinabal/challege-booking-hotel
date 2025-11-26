import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyGuard } from './api-key.guard';
import { Reflector } from '@nestjs/core';
import { ApiKeyStrategy } from './api-key.strategy';
import { ExecutionContext } from '@nestjs/common';
import { API_KEY_METADATA } from './api-key.decorator';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  //let reflector: Reflector;
  // let strategy: ApiKeyStrategy;

  const mockApiKeyStrategy = {
    validate: jest.fn(),
  };

  const mockReflector = {
    get: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {},
      }),
    }),
    getHandler: () => {},
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: ApiKeyStrategy, useValue: mockApiKeyStrategy },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
    //reflector = module.get<Reflector>(Reflector);
    // strategy = module.get<ApiKeyStrategy>(ApiKeyStrategy);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('debería permitir acceso si la ruta NO está protegida', () => {
    mockReflector.get.mockReturnValue(false);

    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(mockReflector.get).toHaveBeenCalledWith(
      API_KEY_METADATA,
      mockExecutionContext.getHandler(),
    );
  });

  it('debería negar acceso si está protegida y la API key es inválida', () => {
    mockReflector.get.mockReturnValue(true); // ruta protegida
    mockApiKeyStrategy.validate.mockReturnValue(false);

    const ctx = {
      ...mockExecutionContext,
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-api-key': 'invalid-key' },
        }),
      }),
    } as ExecutionContext;

    const result = guard.canActivate(ctx);

    expect(result).toBe(false);
    expect(mockApiKeyStrategy.validate).toHaveBeenCalledWith('invalid-key');
  });

  it('debería permitir acceso si la API key es válida', () => {
    mockReflector.get.mockReturnValue(true); // ruta protegida
    mockApiKeyStrategy.validate.mockReturnValue(true);

    const ctx = {
      ...mockExecutionContext,
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-api-key': 'correct-key' },
        }),
      }),
    } as ExecutionContext;

    const result = guard.canActivate(ctx);

    expect(result).toBe(true);
    expect(mockApiKeyStrategy.validate).toHaveBeenCalledWith('correct-key');
  });

  it('debería pasar undefined a validate si el header no está presente', () => {
    mockReflector.get.mockReturnValue(true); // ruta protegida
    mockApiKeyStrategy.validate.mockReturnValue(false);
    const result = guard.canActivate(mockExecutionContext);
    expect(mockApiKeyStrategy.validate).toHaveBeenCalledWith(undefined);
    expect(result).toBe(false);
  });
});
