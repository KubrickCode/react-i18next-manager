import { convertUUID, generateUUID } from './utils';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('UUID Utility Functions', () => {
  it('uuid 생성 성공', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(uuidRegex);
  });

  it('유효한 UUID string을 UUID 타입으로 변환', () => {
    const uuidString = '9094373b-d01c-4359-bf18-3cc66a04505b';
    const convertedUUID = convertUUID(uuidString);
    expect(convertedUUID).toBe(uuidString);
    expect(convertedUUID).toMatch(uuidRegex);
  });

  it('잘못된 UUID string convert 시도', () => {
    const invalidUUID = 'invalid-uuid';
    expect(() => convertUUID(invalidUUID)).toThrow('Invalid UUID');
  });
});
