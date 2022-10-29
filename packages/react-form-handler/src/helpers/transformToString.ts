export const transformToString = (value: any) => {
  let stringifiedValue: null | string = null;

  if (typeof value === "string") {
    stringifiedValue = value;
  } else if (typeof value === "number") {
    stringifiedValue = value.toString();
  }

  return stringifiedValue;
};
