import { Injectable } from '@nestjs/common';
import { join } from 'path';
import {
  DB,
  DBService,
  GroupSchema,
  LocaleSchema,
  TranslationSchema,
} from 'src/db/db.service';
import * as fs from 'fs';

@Injectable()
export class CommonService {
  private db: DB;

  constructor(private readonly dbService: DBService) {
    this.initializeDb();
  }

  private async initializeDb() {
    this.db = await this.dbService.getDb();
  }

  async generateI18nResources() {
    const { locales, groups, translations } = this.db.value();

    await this.generateI18nJson({ locales, groups, translations });
    this.generateTypedI18nKeys({ groups, translations });
  }

  private async generateI18nJson({
    locales,
    groups,
    translations,
  }: {
    locales: LocaleSchema[];
    groups: GroupSchema[];
    translations: TranslationSchema[];
  }) {
    const i18nData = {};

    locales.forEach((locale) => {
      i18nData[locale.label] = { translation: {} };
    });

    const groupPathMap = {};

    const buildGroupPathMap = (group: GroupSchema, parentPath: string = '') => {
      const currentPath = parentPath
        ? `${parentPath}.${group.label}`
        : group.label;
      groupPathMap[group.id] = currentPath;
      group.children.forEach((childGroup) =>
        buildGroupPathMap(childGroup, currentPath),
      );
    };

    groups.forEach((group) => buildGroupPathMap(group));

    translations.forEach((translation) => {
      const translationKey =
        groupPathMap[translation.groupId] + '.' + translation.key;
      translation.values.forEach((value) => {
        const localeLabel = locales.find(
          (locale) => locale.id === value.localeId,
        )?.label;
        if (localeLabel && i18nData[localeLabel]) {
          i18nData[localeLabel].translation[translationKey] = value.value;
        }
      });
    });

    const targetPath = this.dbService.getTargetPath();
    const i18nFilePath = join(targetPath, 'i18n.json');
    fs.writeFileSync(i18nFilePath, JSON.stringify(i18nData, null, 2));

    return { groups, translations };
  }

  private generateTypedI18nKeys({
    groups,
    translations,
  }: {
    groups: GroupSchema[];
    translations: TranslationSchema[];
  }) {
    const groupPathMap = {};

    const buildGroupPathMap = (group: GroupSchema, parentPath: string = '') => {
      const currentPath = parentPath
        ? `${parentPath}.${group.label}`
        : group.label;
      groupPathMap[group.id] = currentPath;
      group.children.forEach((childGroup) =>
        buildGroupPathMap(childGroup, currentPath),
      );
    };

    groups.forEach((group) => buildGroupPathMap(group));

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
}
