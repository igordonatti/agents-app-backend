import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const isPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
// SetMetadata é o que utiliza para criar decorators personalizados
