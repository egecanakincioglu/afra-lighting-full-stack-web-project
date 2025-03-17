import { createDefaultHandler, errorMessages } from "@/src/modules/api/handler";
import {
  idSchema,
  uploadsCategoriesPatchSchema,
  uploadsCategoriesPostSchema,
} from "@/src/modules/api/schemas";
import { productsDB } from "@/src/modules/database/exports";
import { getProductCategories } from "@/src/modules/database/events/getProductCategories";
import { verifyUser } from "@/src/modules/database/events/verifyUser";
import { deleteCategories } from "./files/index";
import { generateId } from "@/src/modules/api/handler";
import { productCategoryMaxCount } from "@/src/lib/config/files";

export default createDefaultHandler({
  async post(req) {
    const { cookies } = req;
    const { status } = await verifyUser(cookies.sessionToken);

    if (!status) return errorMessages.unauthorized;

    const { success, data } = uploadsCategoriesPostSchema.safeParse(req.body);

    if (!success) return errorMessages.badRequest;

    const { index, name } = data;
    const match = getProductCategories().some(
      (item) => item.index === index || item.name === name
    );

    if (match)
      return {
        ...errorMessages.badRequest,
        message: "İsim, veya sıradan birine sahip bir kategori bulunmakta.",
      };

    if (index >= productCategoryMaxCount)
      return {
        ...errorMessages.badRequest,
        message: `En fazla ${productCategoryMaxCount} kategori eklenebilir.`,
      };

    const currentData = getProductCategories();
    const finalItem = { ...data, id: generateId() };
    productsDB.set([...currentData, finalItem]);

    return { status: true, data: finalItem };
  },
  async patch(req) {
    try {
      const { cookies } = req;
      const { status } = await verifyUser(cookies.sessionToken);

      if (!status) return errorMessages.unauthorized;

      const { success, data } = uploadsCategoriesPatchSchema.safeParse(
        req.body
      );

      if (!success) return errorMessages.unauthorized;

      const { id, data: newData } = data;
      const currentData = getProductCategories();
      const item = currentData.find((item) => item.id === id);

      if (!item)
        return {
          ...errorMessages.badRequest,
          message: "Girdiğiniz ID'ye sahip bir kategori bulunmamakta.",
        };

      if (currentData.some((item) => item.name === newData.name))
        return {
          ...errorMessages.badRequest,
          message: "Girdiğiniz isimde bir kategori bulunmakta.",
        };

      const newItem = { ...item, ...newData };
      const newProducts = currentData.map((oldItem) =>
        oldItem.id === id ? newItem : oldItem
      );

      productsDB.set(newProducts);
      return { status: true };
    } catch (error) {
      console.log(error);
      return errorMessages.internal;
    }
  },
  async delete(req) {
    const { cookies } = req;
    const { status } = await verifyUser(cookies.sessionToken);

    if (!status) return errorMessages.unauthorized;

    const { success, data } = idSchema.safeParse(req.body);

    if (!success) return errorMessages.badRequest;

    const { id } = data;
    const currentData = getProductCategories();
    const match = currentData.some((item) => item.id === id);

    if (!match)
      return {
        ...errorMessages.badRequest,
        message: "Girdiğiniz ID'ye sahip bir kategori bulunmamakta.",
      };

    const deletionStatus = await deleteCategories(`products/${id}`);

    if (!deletionStatus.status) return deletionStatus;

    const newData = currentData
      .filter((item) => item.id !== id)
      .sort((a, b) => a.index - b.index)
      .map((item, index) => ({ ...item, index }));

    productsDB.set(newData);
    return { status: true };
  },
  async get() {
    const data = getProductCategories();
    return { status: true, data };
  },
});
