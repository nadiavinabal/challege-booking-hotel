import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyStrategy {
  validate(apiKeyFromHeader: string): boolean {
    const apiKeyEnv = process.env.API_KEY;

    if (!apiKeyFromHeader) {
      throw new ForbiddenException('API key is missing');
    }

    if (apiKeyFromHeader !== apiKeyEnv) {
      throw new ForbiddenException('Invalid API key');
    }

    return true;
  }
}
