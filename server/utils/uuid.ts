import { randomUUID } from 'crypto';

export const uuid = () => randomUUID().replace(/-/g, '');
