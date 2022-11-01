import { transformToString } from "@/helpers/transformToString";
import { validateValue } from "@/helpers/validateValue";
import nestedProperty from "nested-property";
import { FormEventHandler, useEffect, useState } from "react";
import { FormHandler } from "..";

const useFormHandler = <T>(config?: FormHandler.Config<T>): FormHandler.Values<T> => {
  const { initValues = {} as T, preventErrors, common } = config || {};
  const [values, setValues] = useState(initValues);
  const [errors, setErrors] = useState({} as FormHandler.Errors<T>);
  const [touched, setTouched] = useState({} as FormHandler.Touched<T>);

  const addTouchTo = (name: string) => {
    if (!nestedProperty.get(touched, name)) {
      const newTouched = { ...touched };
      nestedProperty.set(newTouched, name, true);
      setTouched(newTouched);
    }
  };

  const removeTouchTo = (name: string) => {
    if (nestedProperty.get(touched, name)) {
      const newTouched = { ...touched };
      nestedProperty.set(newTouched, name, true);
      setTouched(newTouched);
    }
  };

  const injectError = (name: string, value: string) => {
    const newErrors = { ...errors };
    nestedProperty.set(newErrors, name, value);
    setErrors(newErrors);
  };

  const setValue: FormHandler.SetValue<T> = (name, value, config = {}) => {
    const { skipFilter, skipValidator, filter = common?.filter, validator = common?.validator } = config;
    const stringifiedValue = transformToString(value);
    const passFilter = filter && stringifiedValue && !skipFilter ? filter.test(stringifiedValue) : true;
    if (passFilter) {
      if (!skipValidator) {
        const currValidator = validator || common?.validator;
        const error = currValidator ? validateValue(currValidator, value) : null;
        if (error) injectError(name, error);
      }

      const nextValues = { ...values };
      nestedProperty.set(values, String(name), value);
      setValues(nextValues);
    }
  };

  const setInput: FormHandler.SetInput<T> = (name, config = {}) => {
    const { filter = common?.filter, validator = common?.validator, formatter, skipValidator, skipFilter, ...props } = config;
    const onChangeCallback = props.onChange;
    const onFocusCallback = props.onFocus;
    const onBlurCallback = props.onBlur;

    // Set name
    props.name = name as string;

    // Set value
    const value = nestedProperty.get(values, String(name));
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
          if (error) injectError(name, error);

          const nextValues = { ...values };
          nestedProperty.set(values, String(name), value);
          setValues(nextValues);
        }

        onChangeCallback && onChangeCallback(event);
      }
    };

    props.onFocus = (event) => {
      removeTouchTo(name);

      onFocusCallback && onFocusCallback(event);
    };

    props.onBlur = (event) => {
      addTouchTo(name);

      onBlurCallback && onBlurCallback(event);
    };

    return props;
  };

  const findError = (obj: object) => {
    let error = false;
    let counter = 0;
    console.log(obj, typeof obj, "Object");
    for (const key in obj) {
      console.log("Loop", counter++);
      const value = obj[key as keyof typeof obj];
      if (typeof value === "object") {
        const deepError = findError(value);
        if (deepError) {
          error = true;
          break;
        }
      } else if (typeof error === "string") {
        error = true;
        break;
      }
    }

    return error;
  };

  const submitHandler: FormHandler.SubmitHandler<typeof values> = (callback) => {
    const eventHandler: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();
      const error = findError(errors);
      const isError = preventErrors ? error : undefined;
      if (!isError) {
        callback && callback(values, event);
      }
    };
    return eventHandler;
  };

  useEffect(() => {
    if (config?.initValues) {
      setValues(config.initValues);
    }
  }, [config?.initValues]);

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
