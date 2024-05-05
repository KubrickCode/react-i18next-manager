import { Service } from "typedi";
import fs from "fs";
import path from "path";

@Service()
export class DBService {
  private data: any;

  constructor() {
    this.loadData();
  }

  private loadData() {
    const filePath = path.join(__dirname, "../../sample/i18n.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    this.data = JSON.parse(fileContent);
  }

  public getTranslations() {
    return this.data;
  }
}
