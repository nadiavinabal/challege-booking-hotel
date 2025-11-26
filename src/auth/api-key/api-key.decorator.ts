import { SetMetadata } from '@nestjs/common';

export const API_KEY_METADATA = 'api_key_protected';
export const ApiKey = () => SetMetadata(API_KEY_METADATA, true);
