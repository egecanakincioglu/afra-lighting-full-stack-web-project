import type {
  HandlerOptions,
  DefaultHandlerOptions,
  RequestResult,
} from "@/src/@types/database";
import { alphabet } from "@/src/lib/config/id";
import { customAlphabet } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";

const handlerCodeMap: Record<HandlerOptions, string> = {
  post: "POST",
  get: "GET",
  patch: "PATCH",
  delete: "DELETE",
};

export const errorMessages = {
  unauthorized: { status: false, code: 401, message: "Unauthorized" },
  badRequest: { status: false, message: "Bad Request" },
  method: { status: false, code: 405, message: "Method Not Allowed" },
  internal: { status: false, code: 500, message: "Internal Server Error" },
} as const;

export function createDefaultHandler(options: DefaultHandlerOptions) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      const method = req.method;
      const allowedMethods = Object.keys(options).map((code) => {
        const includes = code in handlerCodeMap;

        if (!includes) {
          throw new Error("Invalid handler function code.");
        }

        return [handlerCodeMap[code as HandlerOptions], code];
      }) as [string, HandlerOptions][];

      const [, currentMethod] =
        allowedMethods.find(([m]) => m === method) ?? [];

      if (!currentMethod) return sendResponse(errorMessages.method, res);

      const handler = options[currentMethod];

      if (!handler) return sendResponse(errorMessages.internal, res);

      const result = await handler(req, res);

      if (result) return sendResponse(result, res);
    } catch (error) {
      console.error(error);
      return sendResponse(errorMessages.internal, res);
    }
  };
}

export function sendResponse(
  input: RequestResult,
  response: NextApiResponse
): void {
  const { status, message } = input;
  const finalResponse = status
    ? { status, message, data: input.data }
    : { status, message };
  response.status(status ? 200 : input.code || 400).json(finalResponse);
}

export const generateId = customAlphabet(alphabet, 16);
