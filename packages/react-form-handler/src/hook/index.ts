import { transformToString } from "@/helpers/transformToString";
import { validateValue } from "@/helpers/validateValue";
import { FormEventHandler, useState } from "react";
import { FormHandler } from "..";

const useFormHandler = <T>(config?: FormHandler.Config<T>): FormHandler.Values<T> => {
  const { initValues = {} as T, preventErrors, common } = config || {};

  if (config) {
    const myConfig = config;
    myConfig;
  }

  const [values, setValues] = useState(initValues);
  /* const [formattedValues, setFormattedValues] = useState<T>({ }); */
  const [errors, setErrors] = useState({} as FormHandler.Errors<T>);
  const [touched, setTouched] = useState({} as FormHandler.Touched<T>);

  const setValue: FormHandler.SetValue<T> = (name, value, config = {}) => {
    const { skipFilter, skipValidator, filter, validator } = config;
    const stringifiedValue = transformToString(value);
    const passFilter = filter && stringifiedValue && !skipFilter ? filter.test(stringifiedValue) : true;
    if (passFilter) {
      if (!skipValidator) {
        const currValidator = validator || common?.validator;
        const error = currValidator ? validateValue(currValidator, value) : null;
        if (error) setErrors({ ...errors, [name]: error });
      }

      setValues({ ...values, [name]: value });
    }
  };

  const setInput: FormHandler.SetInput<T> = (name, config = {}) => {
    const { filter, validator, formatter, skipValidator, skipFilter, ...props } = config;
    const onChangeCallback = props.onChange;
    const onFocusCallback = props.onFocus;
    const onBlurCallback = props.onBlur;

    // Set name
    props.name = name as string;

    // Set value
    const value = values[name];
    if (props.type === "checkbox") {
      props.checked = !!value;
    } else if (props.type === "radio") {
      props.checked = Boolean(props.value === (values[name] as unknown));
    } else if (props.type === "file") {
    } else {
      props.value = formatter ? formatter(value) : String(value);
    }

    // Set onChange handler
    props.onChange = (event) => {
      const target = event.target;
      const targetType = target.type;

      // Set value depending of target type
      let value: string | number | boolean | FileList | null;
      if (targetType.includes("number range")) {
        value = target.valueAsNumber;
      } else if (targetType === "checkbox") {
        value = target.checked;
      } else if (targetType === "radio") {
        value = target.value;
        props.checked = Boolean(target.value === (values[name] as unknown));
      } else if (targetType === "files") {
        value = target.files;
      } else {
        value = target.value;
      }

      // Check filter in inputs of text types
      const stringifiedValue = transformToString(value);
      const passFilter = filter && stringifiedValue && !skipFilter ? filter.test(stringifiedValue) : true;
      if (passFilter) {
        // Verify validators
        if (!skipValidator) {
          const currValidator = validator || common?.validator;
          const error = currValidator ? validateValue(currValidator, value) : null;
          if (error) setErrors({ ...errors, [name]: error });

          setValues({ ...values, [name]: value });
        }

        onChangeCallback && onChangeCallback(event);
      }
    };

    props.onFocus = (event) => {
      if (touched[name]) {
        setTouched({ ...touched, [name]: false });
      }

      onFocusCallback && onFocusCallback(event);
    };

    props.onBlur = (event) => {
      if (!touched[name]) {
        setTouched({ ...touched, [name]: true });
      }

      onBlurCallback && onBlurCallback(event);
    };

    return props;
  };

  const submitHandler: FormHandler.SubmitHandler<typeof values> = (callback) => {
    const eventHandler: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();
      const findError = Object.keys(errors).find((key) => Boolean(errors[key as keyof T]));
      const isError = preventErrors ? findError : undefined;
      if (!isError) {
        callback && callback(values, event);
      }
    };
    return eventHandler;
  };

  return {
    submitHandler,
    values,
    errors,
    touched,
    setInput,
    setValue,
  };
};

export { useFormHandler };
