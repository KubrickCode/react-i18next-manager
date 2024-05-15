import { Injectable } from '@nestjs/common';

@Injectable()
export class LocaleRepository {
  async getLocales(): Promise<string[]> {
    return ['en', 'ko', 'zh'];
  }
}
