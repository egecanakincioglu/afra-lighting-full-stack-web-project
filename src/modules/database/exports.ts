import type {
  SQLData,
  FirstLoginData,
  PendingEmailData,
  UploadsData,
  ProductCategoryData,
} from "@/src/@types/database";
import type { PartialRecord } from "@/src/@types/helpers";
import { DatabaseConnection } from "@/src/modules/classes/DatabaseConnection";
import { JSONDatabase } from "@/src/modules/classes/JSONDatabase";
import { VisitorLogger } from "@/src/modules/classes/VisitorLogger";

export const connection = new DatabaseConnection();
export const visitorLogger = new VisitorLogger();

export const sqlDB = new JSONDatabase<SQLData>("./database/sql.json");

export const firstLoginDB = new JSONDatabase<FirstLoginData>(
  "./database/firstLogin.json"
);

export const pendingEmailDB = new JSONDatabase<PartialRecord<PendingEmailData>>(
  "./database/pendingEmails.json"
);

export const metadataDB = new JSONDatabase<UploadsData>(
  "./database/metadata.json"
);

export const productsDB = new JSONDatabase<ProductCategoryData>(
  "./database/products.json"
);
