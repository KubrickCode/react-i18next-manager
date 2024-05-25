import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { DB, DBService, GroupSchema } from 'src/db/db.service';
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

  async generateI18nJson() {
    const { locales, groups, translations } = this.db.value();
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
  }
}
