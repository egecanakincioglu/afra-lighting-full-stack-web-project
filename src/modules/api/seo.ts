import type {
  ComponentSEOConfig,
  PageSEOConfig,
  SEOConfig,
} from "@/src/@types/seo";
import SEO from "../../../seo.json" assert { type: "json" };

export function getSEO(): SEOConfig {
  return SEO;
}

export function getComponentSEO(): ComponentSEOConfig {
  return getSEO().component;
}

export function getPageSEO(): PageSEOConfig {
  return getSEO().page;
}
