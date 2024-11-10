import { paths } from "../codegen";

type ExtractPathParams<T extends string> =
  T extends `${string}{${infer Param}}${infer Rest}`
    ? { [K in Param]: string | number } & ExtractPathParams<Rest>
    : {};

export type Endpoint<P extends keyof paths = keyof paths> =
  P extends `${string}{${string}}`
    ? { path: P; params: ExtractPathParams<P> }
    : P;

export const buildApiPath = <P extends keyof paths>(
  endpoint: Endpoint<P>
): string => {
  if (typeof endpoint === "string") return endpoint;

  let url = endpoint.path as string;
  for (const [key, value] of Object.entries(endpoint.params)) {
    url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
  }
  return url;
};
