import React from "react";
import { useForumu } from "src/hooks/useForumu";

/* type IValues = Record<string, string>; */

const initValues = {
  email: "",
  password: "",
  isOld: false,
  age: 0,
};

export const index = () => {
  const { values, formProps, errors, touched } = useForumu({
    initValues,
    discriminate: true,
    onSubmit: (values, event) => {
      console.log(values, event);
    },
    onChange: (values, event) => {
      console.log(values, event);
    },
    onSubmitError: (errors) => {
      console.log(errors);
    },
    validator: (values) => {
      console.log(values);

      return {};
    },
  });

  return (
    <form {...formProps}>
      <input id="email" type="text" value={values.email} />
      <span>{errors.email && touched.email}</span>
    </form>
  );
};
