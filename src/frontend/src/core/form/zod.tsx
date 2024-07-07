import { z as _z } from "zod";

const customErrorMap: _z.ZodErrorMap = (issue, ctx) => {
  console.error("form validation issue: ", issue);

  if (
    issue.code === z.ZodIssueCode.invalid_type &&
    issue.expected === "string" &&
    (issue.received === "undefined" || issue.received === "null")
  ) {
    return { message: `${issue.path[0]} is required` };
  }

  return { message: issue.message ?? ctx.defaultError };
};

_z.setErrorMap(customErrorMap);

export const z = _z;
