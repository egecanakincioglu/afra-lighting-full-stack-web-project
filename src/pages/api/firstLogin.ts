import {
  getLastCompletedStep,
  step2Verification,
  step3Verification,
} from "@/src/modules/api/firstLogin";
import {
  isBoolean,
  isNumber,
  isObject,
  objectVerify,
} from "@/src/lib/helpers/verifications";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { connection } from "@/src/modules/database/exports";
import { firstLoginDB, sqlDB } from "@/src/modules/database/exports";
import type {
  FirstLoginData,
  FirstLoginGETData,
  FirstLoginStep2,
  MySQLInitalizeOptions,
} from "@/src/@types/database";

async function firstLoginCheck(): Promise<FirstLoginGETData> {
  const currentStep = getLastCompletedStep() + 1;

  const db = (await connection.initalize())?.db;

  if (!db) {
    console.warn("Connection is not initalized");
    return { available: true, currentStep };
  }

  const userCount = await db.users.count();
  return { available: !userCount, currentStep };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      const { available: status, currentStep }: FirstLoginGETData =
        await firstLoginCheck();

      if (!status) {
        return res
          .status(200)
          .json({ message: "You are not the first user", status: false });
      }

      const { body } = req;

      if (!body || ["step", "data"].some((key) => !(key in body))) {
        return res
          .status(400)
          .json({ message: "Gönderdiğiniz veri eksik.", status: false });
      }

      const { step, data } = body as {
        step: number | undefined;
        data: FirstLoginData[keyof FirstLoginData] | undefined;
      };

      if (step !== currentStep) {
        return res.status(400).json({
          message: "Önceki adımları tamamlayın.",
          status: false,
          currentStep,
        });
      }

      if ((!isObject(data) && !isBoolean(data)) || !isNumber(step)) {
        return res.status(400).json({
          message: "Girdiğiniz verileri kontrol edin.",
          status: false,
        });
      }

      switch (step) {
        case 1: {
          if (!isBoolean(data)) {
            return res.status(400).json({
              message: "Girdiğiniz verileri kontrol edin.",
              status: false,
            });
          }

          break;
        }
        case 2: {
          const verificationResult =
            isObject(data) && objectVerify(data, step2Verification);

          if (!verificationResult) {
            return res.status(400).json({
              message: "Girdiğiniz verileri kontrol edin.",
              status: false,
            });
          }

          const { database, password, user, host } = data as FirstLoginStep2;
          const connectionData: MySQLInitalizeOptions = {
            database,
            password,
            user,
            host,
          };

          const initalizationResult = await connection.initalize(
            connectionData
          );

          if (!initalizationResult) {
            return res.status(400).json({
              message: "Veritabanı bağlantısı başarısız.",
              status: false,
            });
          }

          sqlDB.set(connectionData);
          break;
        }
        case 3: {
          const verificationResult =
            isObject(data) && objectVerify(data, step3Verification);

          if (!verificationResult) {
            return res.status(400).json({
              message: "Girdiğiniz verileri kontrol edin.",
              status: false,
            });
          }

          break;
        }
        case 4: {
          const lastData = firstLoginDB.get();
          const email = lastData.step3?.email;
          const password = lastData.step3?.password;

          if (!email || !password) {
            return res
              .status(400)
              .json({ message: "Email veya şifre eksik.", status: false });
          }

          const passwordHash = bcrypt.hashSync(password, 10);
          await connection.db.users.create({
            data: {
              email,
              password_hash: passwordHash,
              username: email,
            },
          });
          firstLoginDB.reset();

          return res
            .status(200)
            .json({ message: "Kurulum başarıyla tamamlandı", status: true });
        }
        default: {
          return res
            .status(400)
            .json({ message: "Yanlış aşamadasınız.", status: false });
        }
      }

      firstLoginDB.overwriteKey(`step${step}`, data);

      return res
        .status(200)
        .json({ message: "Adım başarıyla tamamlandı", status: true });
    }
    case "GET": {
      const data = await firstLoginCheck();
      return res.status(200).json(data);
    }
    default: {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
}
