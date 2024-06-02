import { UUID } from './types';
import { v4 as uuidv4, validate } from 'uuid';

export const generateUUID = (): UUID => {
  return uuidv4() as UUID;
};

export const convertUUID = (uuid: string): UUID => {
  if (!validate(uuid)) throw new Error('Invalid UUID');
  return uuid as UUID;
};
