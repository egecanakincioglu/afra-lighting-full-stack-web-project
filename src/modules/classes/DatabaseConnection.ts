import { getFilePath } from "@/src/modules/helpers/files";
import type { MySQLInitalizeOptions } from "@/src/@types/database";
import { sqlDB } from "@/src/modules/database/exports";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export class DatabaseConnection {
  private connection: PrismaClient | undefined;

  public async initalize(
    options: Partial<MySQLInitalizeOptions> | undefined = sqlDB.get()
  ): Promise<this | undefined> {
    if (this.connection) return this;
    if (globalForPrisma.prisma) {
      this.connection = globalForPrisma.prisma;
      return this;
    }

    if (!options) return;

    const { host, user, password, database } = options;

    if (!host || !user || !password || !database) return;

    const tempDatasourceURL = `mysql://${user}:${password}@${host}`;
    const datasourceURL = `${tempDatasourceURL}/${database}`;
    process.env.DATABASE_URL = datasourceURL;

    try {
      const connection = new PrismaClient({
        // log: ["query", "info", "warn", "error"],
      });
      await connection.$connect();
      const tableQueries = this.getScript("CreateTable").split("\n\n");

      for (const query of tableQueries) {
        await connection.$queryRawUnsafe(query);
      }

      this.connection = connection;
      globalForPrisma.prisma = connection;

      return this;
    } catch (error) {
      console.error("Error initalizing database", error);
    }
  }

  public get db(): PrismaClient {
    if (!(this.connection || globalForPrisma.prisma)) {
      throw new Error("Database not initalized");
    }

    return this.connection || globalForPrisma.prisma;
  }

  private getScript(scriptName: string): string {
    return readFileSync(
      getFilePath("src", "modules", "database", "scripts", `${scriptName}.sql`),
      "utf8"
    );
  }
}
