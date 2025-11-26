import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiKeyStrategy } from './api-key.strategy';
import { API_KEY_METADATA } from './api-key.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private apiKeyStrategy: ApiKeyStrategy,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const isProtected = this.reflector.get<boolean>(
      API_KEY_METADATA,
      context.getHandler(),
    );

    // Si la ruta NO está marcada con @ApiKey(), se permite
    if (!isProtected) return true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const apiKeyHeader = request.headers['x-api-key'];

    return this.apiKeyStrategy.validate(apiKeyHeader);
  }
}
