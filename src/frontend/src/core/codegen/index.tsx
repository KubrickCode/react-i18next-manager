import { components } from "./generated";

export * from "./generated";
export type SchemaDto<K extends keyof components["schemas"]> =
  components["schemas"][K];
