import { FormHandler } from "..";
import { transformToString } from "./transformToString";

const validateValue = (validator: FormHandler.Validator, value: unknown) => {
  const stringifiedValue = transformToString(value);
  let message: string | null = null;

  if (Array.isArray(validator)) {
    validator.find((validator) => {
      if (typeof validator === "function") {
        const error = validator(value);
        if (error) message = error;
      } else if (typeof validator === "object" && stringifiedValue) {
        if (!validator.regex.test(stringifiedValue)) message = validator.message;
      }

      return message;
    });
  } else if (typeof validator === "function") {
    const error = validator(value);
    if (error) message = error;
  } else if (typeof validator === "object" && stringifiedValue) {
    if (!validator.regex.test(stringifiedValue)) message = validator.message;
  }

  return message;
};

export { validateValue };
