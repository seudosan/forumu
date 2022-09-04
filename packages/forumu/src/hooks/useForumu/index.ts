import { useState, useEffect, FormEventHandler, FormEvent, FocusEventHandler, FocusEvent, ChangeEventHandler } from "react";
import { IForumu } from "../../types";

type IForumu = <T>(config: IForumu.Config<T>) => IForumu.Properties<T>;

export const useForumu: IForumu = ({
  initValues,
  onSubmit,
  onChange,
  onSubmitError,
  filter,
  validator,
  touchedOnly = true,
  preventError = true,
  discriminate = true,
}) => {
  // Types
  type FieldsType = typeof initValues;
  type ErrorsType = IForumu.Errors<FieldsType>;

  /* States */
  const [fields, setFields] = useState<FieldsType>(initValues || ({} as FieldsType));
  const [errors, setErrors] = useState<ErrorsType>({});
  const [touched, setTouched] = useState<IForumu.Touched<FieldsType>>({});

  const addTouched = (name: keyof typeof touched) => {
    !touched[name] &&
      setTouched({
        ...touched,
        [name]: true,
      });
  };

  const removeTouched = (name: string) => {
    touched[name as keyof FieldsType] &&
      setTouched({
        ...touched,
        [name]: false,
      });
  };

  const resetForm: IForumu.Reset<typeof fields> = (key) => {
    if (!key) {
      setFields(initValues);
      setTouched({});
      setErrors({});
    } else if (typeof key === "string") {
      removeTouched(key);

      setFields({
        ...fields,
        [key]: initValues[key as keyof FieldsType],
      });

      setErrors({
        ...errors,
        [key]: undefined,
      });
    } else if (Array.isArray(key)) {
      const newFields = { ...fields };
      const newErrors = { ...errors };
      const newTouched = { ...touched };

      key.forEach((key) => {
        newFields[key] = initValues[key];
        newErrors[key] = undefined;
        newTouched[key] = false;
      });

      setFields(newFields);
      setErrors(newErrors);
      setTouched(newTouched);
    }
  };

  const validateFields = () => {
    if (validator) {
      let errors: ErrorsType = {};
      validator(fields, errors);

      if (touchedOnly) {
        const touchedErrors: ErrorsType = {};

        Object.keys(touched).forEach((key) => errors[key as keyof ErrorsType] && (touchedErrors[key as keyof ErrorsType] = errors[key as keyof ErrorsType]));

        errors = touchedErrors;
      }

      setErrors(errors);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent<HTMLFormElement>) => {
    /* Prevent default Form action */
    event.preventDefault();

    /* Validate fields using validator callback */
    if (preventError && validator) {
      const errors: ErrorsType = {};
      validator(fields, errors);

      /* Check if any key contain an error */
      let touchedErrors: null | Record<string, boolean> = null;
      Object.keys(errors).forEach((key) => {
        if (touchedErrors) {
          touchedErrors[key] = true;
        } else {
          touchedErrors = {
            [key]: true,
          };
        }
      });

      if (touchedErrors) {
        onSubmitError && onSubmitError(errors, fields);
        setTouched(touchedErrors);
        return setErrors(errors);
      }
    }

    // It's all OK, then execute onSubmit()
    return onSubmit && onSubmit(fields, event);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target;
    const name = target.name;

    let value = target.value as any;
    if (discriminate) {
      switch (target.type) {
        case "checkbox":
          value = target.checked;
          break;
        case "file":
          value = target.files;
          break;
      }
    }

    const allowEntry = filter ? filter(name, event) : true;

    if (allowEntry) {
      removeTouched(name);
      const updatedValues = { ...fields, [name]: value };
      onChange && onChange(updatedValues, event);
      setFields(updatedValues);
    }
  };

  const handleReset: FormEventHandler<HTMLFormElement> = (event: FormEvent<HTMLFormElement>) => {
    // Prevent default action
    event.preventDefault();

    resetForm();
  };

  const handleBlurCapture: FocusEventHandler<HTMLFormElement> = ({ target }: FocusEvent<HTMLFormElement>) => {
    addTouched(target.name as keyof FieldsType);
  };

  useEffect(() => {
    validateFields();
  }, [fields]);

  useEffect(() => {
    validateFields();
  }, [touched]);

  return {
    fields,
    resetForm: resetForm,
    touched,
    errors,
    props: {
      form: {
        noValidate: true,
        onSubmit: handleSubmit,
        onReset: handleReset,
        onBlurCapture: touchedOnly ? handleBlurCapture : undefined,
      },
      input: {
        onChange: handleChange,
      },
    },
  };
};
