import type {
  BodyParserKey,
  ExtractTypes,
  ArrayMapperFunction,
  ArrayRecord,
  ObjectArray,
  ForcedValue,
} from "@/src/@types/helpers";
import { isObject, isNumber } from "./verifications";
import type {
  FormDataInput,
  RequestResult,
  UploadsFile,
} from "@/src/@types/database";
import { errorMessages } from "@/src/modules/api/handler";
import type {
  UploadsFileMetadata,
  UploadsProductMetadata,
} from "@/src/modules/api/schemas";

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const shallowCopy = { ...obj };
  keys.forEach((key) => {
    delete shallowCopy[key];
  });
  return shallowCopy;
}

export async function parseRequestResult<Data>(
  response: Response
): Promise<RequestResult<Data>> {
  try {
    return (await response.json()) as RequestResult<Data>;
  } catch {
    return errorMessages.internal;
  }
}

export function omitIfNullish<Item extends object>(
  item: Item,
  key: keyof Item,
  value: unknown
) {
  return [undefined, null, ""].find((v) => v === value)
    ? omit(item, [key])
    : { ...item, [key]: value };
}

export function pick<Item, Key extends keyof Item>(
  item: Item,
  keys: Key[]
): Pick<Item, Key> {
  return keys.reduce(
    (total, current) => ({
      ...total,
      [current]: item[current],
    }),
    {}
  ) as Pick<Item, Key>;
}

export function objectParser<BodyKeys extends BodyParserKey<unknown>[]>(
  body: unknown,
  keys: BodyKeys
): ExtractTypes<BodyKeys> {
  const keyLength = keys.length;
  const finalValues = [] as ExtractTypes<BodyKeys>;

  if (!isObject(body)) {
    finalValues.push(...createArray(keyLength, () => undefined));
  } else {
    for (const [key, verify] of keys) {
      const value = body[key as keyof typeof body];
      const keyCheck = key in body && verify(value);
      finalValues.push(keyCheck ? value : undefined);
    }
  }

  return finalValues;
}

export function getKeyConditionally<Object, Key extends string, DefaultValue>(
  obj: Object,
  key: Key,
  defaultValue: DefaultValue
): DefaultValue {
  return (
    isObject(obj)
      ? key in obj
        ? obj[key as unknown as keyof typeof obj]
        : defaultValue
      : defaultValue
  ) as DefaultValue;
}

export function createArray<OutputType>(
  elementSize: number,
  mapperFunction: ArrayMapperFunction<OutputType>
): OutputType[] {
  return Array.from({ length: elementSize }, (_, index) =>
    mapperFunction(index)
  );
}

export function removeNullishValues<Obj>(
  obj: Obj,
  additions: unknown[] = []
): Obj {
  if (!isObject(obj)) return obj;

  const omittedValuesList = [undefined, null, ...additions];

  return Object.entries(obj).reduce(
    (total, [key, value]) =>
      omittedValuesList.includes(value)
        ? total
        : { ...total, [key]: removeNullishValues(value, additions) },
    {} as Obj
  );
}

export function mergeArraysToObjectArray<Obj extends ArrayRecord>(
  obj: Obj
): ObjectArray<Obj> {
  const arrays = Object.values(obj);

  if (!arrays.length) throw new Error("At least one array is required.");

  const arrayLengthMap = arrays.map((array) => array?.length).filter(isNumber);

  if (Math.min(...arrayLengthMap) !== Math.max(...arrayLengthMap))
    throw new Error("All input arrays should have same length.");

  const firstArray = arrays.at(0)!;
  const keys = Object.keys(obj);

  return firstArray.reduce(
    (total, _, index) => [
      ...(total as ObjectArray<Obj>),
      keys.reduce((t, c) => ({ ...t, [c]: obj[c]?.[index] }), {}),
    ],
    []
  ) as ObjectArray<Obj>;
}

export function isProductFile(
  item: UploadsFile
): item is UploadsFile<UploadsProductMetadata> {
  return item.category.startsWith("products/");
}

export function getProductFile<Force extends boolean = false>(
  item: UploadsFile | undefined,
  force?: Force
): ForcedValue<UploadsFile<UploadsProductMetadata>, Force> {
  type ReturnType = ForcedValue<UploadsFile<UploadsProductMetadata>, Force>;

  if (!item) {
    if (force) throw new Error("Given file should not be undefined.");
    return undefined as ReturnType;
  }

  const result = isProductFile(item);

  if (!result) {
    if (force) throw new Error("Given file is not a product file.");
    return undefined as ReturnType;
  }

  return item as ReturnType;
}

export function isNormalFile(
  item: UploadsFile
): item is UploadsFile<UploadsFileMetadata> {
  return !item.category.startsWith("products/");
}

export function getNormalFile<Force extends boolean = false>(
  item: UploadsFile | undefined,
  force?: Force
): ForcedValue<UploadsFile<UploadsFileMetadata>, Force> {
  type ReturnType = ForcedValue<UploadsFile<UploadsFileMetadata>, Force>;

  if (!item) {
    if (force) throw new Error("Given file should not be undefined.");
    return undefined as ReturnType;
  }

  const result = isNormalFile(item);

  if (!result) {
    if (force) throw new Error("Given file is not a normal file.");
    return undefined as ReturnType;
  }

  return item as ReturnType;
}

export function createFormData(inputs: FormDataInput[]): FormData {
  const form = new FormData();

  inputs.forEach((input, index) => {
    const { file, ...data } = input;
    const { metadata, ...mainData } = data;

    const mainDataEntries = Object.entries(
      mainData as unknown as Record<string, string | number>
    ).map(
      ([key, value]) =>
        [`${key}[${index}]`, value.toString()] satisfies [string, string]
    );

    const metadataEntries = metadata
      ? Object.entries(removeNullishValues(metadata)).map(
          ([key, value]) =>
            [`metadata[${index}][${key}]`, value!.toString()] satisfies [
              string,
              string
            ]
        )
      : [];

    const finalEntries = [
      ["files", file],
      ...mainDataEntries,
      ...metadataEntries,
    ] satisfies [string, string | File][];

    finalEntries.forEach(([key, value]) => {
      form.set(key, value);
    });
  });

  return form;
}
