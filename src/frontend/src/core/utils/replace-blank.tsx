export const replaceBlank = (string: string) => {
  if (!string.includes(" ")) return string;
  return string.replace(" ", "");
};
