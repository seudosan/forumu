import { InputHTMLAttributes, FormEventHandler, FormEvent } from "react";

export namespace FormHandler {
  export type SubmitHandler<T> = (callback: (values: T, event: FormEvent<HTMLFormElement>) => void) => FormEventHandler<HTMLFormElement>;
  type ValidatorCallback = (value: unknown) => string | void;
  export type Errors<T> = Readonly<{
    [Property in keyof T]?: string;
  }>;
  export type Touched<T> = Readonly<{
    [Property in keyof T]?: boolean;
  }>;

  export type Validator = Array<RegExpValidator | ValidatorCallback> | RegExpValidator | ValidatorCallback;

  interface RegExpValidator {
    regex: RegExp;
    message: string;
  }

  interface SetInputConfig extends InputHTMLAttributes<HTMLInputElement> {
    validator?: Validator;
    filter?: RegExp;
    formatter?: (value: unknown) => string;
    skipFilter?: boolean;
    skipValidator?: boolean;
  }

  interface SetValueConfig {
    validator?: Validator;
    filter?: RegExp;
    formatter?: (value: unknown) => string;
    skipFilter?: boolean;
    skipValidator?: boolean;
  }

  export type DefaultValues = {
    [x: string]: unknown;
  };
  export type SetInput<T = DefaultValues> = (name: keyof T, config?: SetInputConfig) => InputHTMLAttributes<HTMLInputElement>;

  export type SetValue<T = DefaultValues> = (name: keyof T, value: unknown, config?: SetValueConfig) => void;

  export interface Config<T> {
    initValues?: T;
    preventErrors?: boolean;
    common?: {
      validator?: Array<RegExpValidator | ValidatorCallback> | RegExpValidator | ValidatorCallback;
      filter?: RegExp;
    };
  }

  export interface Values<T = {}> {
    errors: Errors<T>;
    submitHandler: SubmitHandler<T>;
    setInput: SetInput<T>;
    setValue: SetValue<T>;
    touched: Touched<T>;
    values: T;
  }
}
