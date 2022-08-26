import { ChangeEvent, FocusEventHandler, FormEvent, FormEventHandler } from "react";
import { boolean } from "yup";

export type ForumuEventSubmit<T> = (values: T, event: FormEvent<HTMLFormElement>) => void;
export type ForumuEventChange<T> = (values: T, event: ChangeEvent<HTMLFormElement>) => void;
/* export type ForumuFilter = (values: T, event: ChangeEvent<HTMLFormElement>) => any; */
export type ForumuValidator<T> = (values: T) => ForumuErrors<T>;
export type ForumuEventError<T> = (errors: ForumuErrors<T>, values: T) => void;
export type ForumuErrors<T> = Partial<Record<keyof T, string>>;
export type ForumuTouched<T> = Partial<Record<keyof T, boolean>>;

export type ForumuInitValues = Record<string, any>;

interface ForumuConfig<T> {
  initValues: T;
  onSubmit?: ForumuEventSubmit<T>;
  onChange?: ForumuEventChange<T>;
  onSubmitError?: ForumuEventError<T>;
  validator?: ForumuValidator<T>;
  filter?: any;
  touchedOnly?: boolean;
  preventError?: boolean;
  discriminate?: boolean;
}

interface ForumuValues<T> {
  values: T;
  touched: ForumuTouched<T>;
  errors: ForumuErrors<T>;
  formProps: {
    noValidate: boolean;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onChange: FormEventHandler<HTMLFormElement>;
    onBlurCapture: FocusEventHandler<HTMLFormElement> | undefined;
  };
}

export type Forumu = <T extends ForumuInitValues>(config: ForumuConfig<T>) => ForumuValues<T>;
