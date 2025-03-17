import { createDefaultHandler } from "@/src/modules/api/handler";
import { getSEO } from "@/src/modules/api/seo";

export default createDefaultHandler({
  async get() {
    const data = getSEO();
    return { status: true, data };
  },
});
