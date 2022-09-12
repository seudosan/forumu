import { ChangeEvent as ReactChangeEvent, ChangeEventHandler, FocusEventHandler, FormEvent, FormEventHandler } from "react";

export namespace IForumu {
  // Interfaces
  export type Filter<T> = {
    name: keyof T;
    fields: T;
    prevFields: T;
  } & {};

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

  export type FilterCallback<T> = (entry: Filter<T>, event: ReactChangeEvent<HTMLInputElement>) => boolean;

  // Events
  export type SubmitEvent<T> = (fields: T, event: FormEvent<HTMLFormElement>) => void;

  export type ChangeEvent = (event: ReactChangeEvent<HTMLInputElement>) => void;

  export type ErrorEvent<T> = (errors: Errors<T>, fields: T) => void;

  // Setup
  export interface Config<T> {
    initValues: T;
    onSubmit?: SubmitEvent<T>;
    onChange?: ChangeEvent;
    onSubmitError?: ErrorEvent<T>;
    validator?: ValidatorCallback<T>;
    filter?: FilterCallback<T>;
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
