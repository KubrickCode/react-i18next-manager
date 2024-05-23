import { generateUUID } from './utils';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('generateUUID', () => {
  it('should return a valid UUID', () => {
    const uuid = generateUUID();

    expect(uuidRegex.test(uuid)).toBe(true);
  });
});
