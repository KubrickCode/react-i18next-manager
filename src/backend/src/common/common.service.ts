import { Injectable } from '@nestjs/common';
import { join } from 'path';
import {
  DBService,
  GroupSchema,
  LocaleSchema,
  TranslationSchema,
} from 'src/db/db.service';
import * as fs from 'fs';
import { UUID } from './types';
import { DBAdapter } from 'src/db/db.adapter';

@Injectable()
export class CommonService extends DBAdapter {
  constructor(protected readonly dbService: DBService) {
    super(dbService);
  }

  async generateI18nResources() {
    const { locales, groups, translations } = this.db.value();

    const i18nData = this.buildI18nData({ locales, groups, translations });
    this.writeI18nJson(i18nData);

    this.generateTypedI18nKeys({ groups, translations });
  }

  private generateTypedI18nKeys({
    groups,
    translations,
  }: {
    groups: GroupSchema[];
    translations: TranslationSchema[];
  }) {
    const groupPathMap = this.buildGroupPathMap(groups);

    const keys: { [key: string]: any } = {};

    translations.forEach((translation) => {
      const groupLabel = groupPathMap[translation.groupId];
      const keyPath = `${groupLabel}.${translation.key}`;
      const keyParts = keyPath.split('.');

      let current = keys;
      keyParts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === keyParts.length - 1 ? keyPath : {};
        }
        current = current[part];
      });
    });

    const generateTypeScript = (obj: any): string => {
      let result = '{';
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
          result += `${key}: "${obj[key]}",`;
        } else {
          result += `${key}: ${generateTypeScript(obj[key])},`;
        }
      }
      result += '}';
      return result;
    };

    const typeSafeI18nKeys = `export const i18n = {keys: ${generateTypeScript(keys)}};export default i18n;`;

    const outputPath = join(this.dbService.getTargetPath(), 'i18n-keys.ts');
    fs.writeFileSync(outputPath, typeSafeI18nKeys, 'utf-8');
  }

  private buildI18nData({
    locales,
    groups,
    translations,
  }: {
    locales: LocaleSchema[];
    groups: GroupSchema[];
    translations: TranslationSchema[];
  }): any {
    const initializedLocales = this.initializeLocales(locales);
    const groupPathMap = this.buildGroupPathMap(groups);
    const populatedTranslations = this.populateTranslations(
      initializedLocales,
      translations,
      locales,
      groupPathMap,
    );
    return populatedTranslations;
  }

  private buildGroupPathMap(groups: GroupSchema[]): { [key: string]: string } {
    const groupPathMap: { [key: string]: string } = {};

    const buildPath = (groupId: UUID, path: string) => {
      groupPathMap[groupId] = path;
      groups
        .filter((group) => group.parentId === groupId)
        .forEach((group) => buildPath(group.id, `${path}.${group.label}`));
    };

    groups
      .filter((group) => group.parentId === null)
      .forEach((group) => buildPath(group.id, group.label));

    return groupPathMap;
  }

  private initializeLocales(locales: LocaleSchema[]): any {
    return locales.reduce((acc, locale) => {
      acc[locale.label] = { translation: {} };
      return acc;
    }, {});
  }

  private populateTranslations(
    i18nData: any,
    translations: TranslationSchema[],
    locales: LocaleSchema[],
    groupPathMap: { [key: string]: string },
  ): any {
    const newI18nData = { ...i18nData };

    translations.forEach((translation) => {
      const translationKey =
        groupPathMap[translation.groupId] + '.' + translation.key;
      translation.values.forEach((value) => {
        const localeLabel = locales.find(
          (locale) => locale.id === value.localeId,
        )?.label;
        if (localeLabel && newI18nData[localeLabel]) {
          newI18nData[localeLabel] = {
            ...newI18nData[localeLabel],
            translation: {
              ...newI18nData[localeLabel].translation,
              [translationKey]: value.value,
            },
          };
        }
      });
    });

    return newI18nData;
  }

  private writeI18nJson(i18nData: any) {
    const targetPath = this.dbService.getTargetPath();
    const i18nFilePath = join(targetPath, 'i18n.json');
    fs.writeFileSync(i18nFilePath, JSON.stringify(i18nData, null, 2));
  }
}
