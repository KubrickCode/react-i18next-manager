import { UUID } from './types';
import { v4 as uuidv4 } from 'uuid';

export const generateUUID = (): UUID => {
  return uuidv4() as UUID;
};
