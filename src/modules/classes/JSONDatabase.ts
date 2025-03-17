import { writeFileSync, existsSync, readFileSync } from "fs";

export class JSONDatabase<DatabaseStructure> {
  private databasePath: string;

  constructor(databasePath: string) {
    if (!existsSync(databasePath)) {
      writeFileSync(databasePath, JSON.stringify({}));
    }

    this.databasePath = databasePath;
  }

  public get(): Partial<DatabaseStructure> {
    return JSON.parse(readFileSync(this.databasePath, "utf-8"));
  }

  public getKey<K extends keyof DatabaseStructure>(
    key: K
  ): DatabaseStructure[K] | undefined {
    return this.get()[key];
  }

  public set(data: Partial<DatabaseStructure>): void {
    writeFileSync(this.databasePath, JSON.stringify(data), "utf-8");
  }

  public overwrite(data: Partial<DatabaseStructure>): void {
    const currentData = this.get();
    const newData = { ...currentData, ...data };
    this.set(newData);
  }

  public setKey<K extends keyof DatabaseStructure>(
    key: K,
    value: DatabaseStructure[K]
  ): void {
    const currentData = this.get();
    currentData[key] = value;
    this.set(currentData);
  }

  public overwriteKey<K extends keyof DatabaseStructure>(
    key: K,
    value: Partial<DatabaseStructure[K]>
  ): void {
    const currentData = this.get();
    const currentValue = currentData[key];
    currentData[key] = { ...currentValue, ...value } as DatabaseStructure[K];
    this.set(currentData);
  }

  public deleteKey<K extends keyof DatabaseStructure>(key: K): void {
    const currentData = this.get();
    delete currentData[key];
    this.set(currentData);
  }

  public reset(): void {
    this.set({});
  }
}
