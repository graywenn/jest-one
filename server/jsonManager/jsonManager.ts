import fs from 'fs';
export class JsonManager<T> {
  private filePath: string;
  private items: T[];

  constructor(filePath: string) {
    this.filePath = filePath;
    this.items = [];
  }

  private isEmptyData(item: T | undefined | null): boolean {
    return !item || !Object.keys(item).length;
  }

  private async catchError(fn: () => void) {
    try {
      return await fn();
    } catch (err) {
      throw new Error('Create directory error' + `\n ${err}`);
    }
  }

  private getJsonFullDirectory() {
    const pathArray = this.filePath.split('/');
    pathArray.pop();
    return pathArray.join('/');
  }

  private async read(): Promise<T[]> {
    // const stream = fs.createReadStream(this.filePath, { encoding: 'utf-8' });
    // let data = '';
    // for await (const chunk of stream) {
    //   data += chunk;
    // }
    const data = await fs.readFileSync(this.filePath, { encoding: 'utf-8' });
    this.items = JSON.parse(data);
    return this.items;
  }

  private async write(): Promise<void> {
    // const stream = fs.createWriteStream(this.filePath, { encoding: 'utf-8' });
    // stream.write(JSON.stringify(this.items));
    // stream.end();
    // await new Promise((resolve) => stream.on('finish', resolve));
    await fs.writeFileSync(this.filePath, JSON.stringify(this.items), {
      encoding: 'utf-8',
    });
  }

  private async jsonExist() {
    return await fs.existsSync(this.filePath);
  }

  private async createDirectory() {
    await this.catchError(async () => {
      await fs.mkdirSync(this.getJsonFullDirectory(), { recursive: true });
    });
  }

  public async init(values: T[] = [], clear = false) {
    const fileExist = await this.jsonExist();
    if (!fileExist || clear) {
      await this.createDirectory();
      this.items = values;
      await this.write();
    }
  }

  public async add(item: T): Promise<T> {
    if (this.isEmptyData(item)) {
      throw new Error('Item cannot be empty');
    }
    await this.read();
    this.items.push(item);
    await this.write();
    return item;
  }

  public async getByField(
    field: keyof T,
    value: T[keyof T]
  ): Promise<T | undefined> {
    await this.read();
    return this.items.find((item) => item[field] === value);
  }

  public async getListByField(field: keyof T, value: T[keyof T]): Promise<T[]> {
    await this.read();
    return this.items.filter((item) => item[field] === value);
  }

  public async getAll(): Promise<T[]> {
    return await this.read();
  }

  public async updateByField(
    field: keyof T,
    value: T[keyof T],
    item: T
  ): Promise<T> {
    await this.read();
    const index = this.items.findIndex((item: T) => item[field] === value);
    if (index < 0) {
      return null;
    }
    this.items[index] = { ...item };
    await this.write();
    return this.items[index];
  }

  public async deleteByField(
    field: keyof T,
    value: T[keyof T]
  ): Promise<number> {
    await this.read();
    const index = this.items.findIndex((item) => item[field] === value);
    if (index !== -1) {
      this.items.splice(index, 1);
      await this.write();
    }
    return index;
  }
}
