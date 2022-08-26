import { useState, useEffect, FormEventHandler, FormEvent, ChangeEvent, FocusEventHandler, FocusEvent } from "react";
import { Forumu, ForumuErrors, ForumuTouched } from "./forumu";

export const useForumu: Forumu = ({
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
  /* States */
  const [fields, setFields] = useState(initValues);
  const [errors, setErrors] = useState<ForumuErrors<typeof initValues>>({});
  const [touched, setTouched] = useState<ForumuTouched<typeof initValues>>({});

  const addTouched: FocusEventHandler<HTMLFormElement> = ({ target }: FocusEvent<HTMLFormElement>) => {
    const name = target.name;

    !touched[name] &&
      setTouched({
        ...touched,
        [name]: true,
      });
  };

  const removeTouched = (name: string) => {
    touched[name] &&
      setTouched({
        ...touched,
        [name]: false,
      });
  };

  const validateFields = () => {
    if (validator) {
      let errors = validator(fields);

      if (touchedOnly) {
        const touchedErrors: ForumuErrors<typeof initValues> = {};
        type ErrorsKeys = keyof typeof initValues;

        (Object.keys(touched) as Array<ErrorsKeys>).forEach((name) => errors[name] && (touchedErrors[name] = errors[name]));

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
      const errors = await validator(fields);

      /* Check if any key contain an error */
      const anError = Object.keys(errors).find((name) => Boolean(errors[name]));

      if (anError) {
        onSubmitError && onSubmitError(errors, fields);
        return setErrors(errors);
      }
    }

    // It's all OK, then execute onSubmit()
    return onSubmit && onSubmit(fields, event);
  };

  const handleChange: FormEventHandler<HTMLFormElement> = (event: ChangeEvent<HTMLFormElement>) => {
    const target = event.currentTarget;
    const name = target.name;

    let value = target.value;
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

    if (filter) {
      //  
      //    Execute filter function and validate the returned value:
      //    - If the return of filter is "Boolean" with "false" value, the
       //   fields will not be updated. If it is "true", the flow will be normal.
        //  - If is it another type, then the current value will be replaced by
        //  the returned value.
      
      const result = filter({
        field: name,
        value,
      }, event)

      if (result) {
        if (typeof result === 'boolean' && !result) {
           return
        }

        value = result
    }

    removeTouched(name);

    const updatedValues = { ...fields, [name]: value };
    /* Future feature:
        onChange({
          fieldName: // target.name
          currValue: // value
          prevValue: // fields[name]
        },
        event // Current Event
        )
    */
    onChange && onChange(updatedValues, event);
    setFields(updatedValues);
  };

  useEffect(() => {
    validateFields();
  }, [fields]);

  useEffect(() => {
    validateFields();
  }, [touched]);

  return {
    values: fields,
    touched,
    errors,
    formProps: {
      noValidate: true,
      onSubmit: handleSubmit,
      onChange: handleChange,
      onBlurCapture: touchedOnly ? addTouched : undefined,
    },
  };
};
