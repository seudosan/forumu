import { ChangeEvent as ReactChangeEvent, ChangeEventHandler, FocusEventHandler, FormEvent, FormEventHandler } from "react";

export namespace IForumu {
  // Values
  export type Fields<T = Record<string, any>> = Readonly<T>;

  export type Reset<T> = (key?: keyof T | (keyof T)[]) => void;

  export type Errors<T> = {
    [Property in keyof T]?: string;
  } & {};

  export type Touched<T> = {
    [Property in keyof T]?: boolean;
  } & {};

  // Callbacks
  export type ValidatorCallback<T> = (fields: T, errors: Errors<T>) => void;

  export type FilterCallback<T> = (key: keyof T | (string & {}), event: ReactChangeEvent<HTMLInputElement>) => boolean;

  // Events
  export type SubmitEvent<T> = (fields: T, event: FormEvent<HTMLFormElement>) => void;

  export type ChangeEvent<T> = (fields: T, event: ReactChangeEvent<HTMLInputElement>) => void;

  export type ErrorEvent<T> = (errors: Errors<T>, fields: T) => void;

  // Setup
  export interface Config<T> {
    initValues: T;
    onSubmit?: SubmitEvent<T>;
    onChange?: ChangeEvent<T>;
    onSubmitError?: ErrorEvent<T>;
    validator?: ValidatorCallback<T>;
    filter?: FilterCallback<T>;
    touchedOnly?: boolean;
    preventError?: boolean;
    discriminate?: boolean;
  }

  export interface Properties<T> {
    fields: Fields<T>;
    resetForm: Reset<T>;
    touched: Readonly<Touched<T>>;
    errors: Readonly<Errors<T>>;
    props: {
      form: {
        noValidate: boolean;
        onSubmit: FormEventHandler<HTMLFormElement>;
        onReset: FormEventHandler<HTMLFormElement>;
        onBlurCapture: FocusEventHandler<HTMLFormElement> | undefined;
      };
      input: {
        onChange: ChangeEventHandler<HTMLInputElement>;
      };
    };
  }
}
