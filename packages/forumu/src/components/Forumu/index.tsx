import React from "react";
import { useForumu } from "../../hooks/useForumu";

/* type IValues = Record<string, string>; */

const initValues = {
  email: "",
  password: "",
  isOld: false,
  age: 0,
};

const index = () => {
  const { fields, props, errors, touched, resetForm } = useForumu({
    initValues: { name: "", isOld: false },
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
    validator: (values, errors) => {
      if (values.isOld) {
        errors.isOld = "Hello world";
      }
    },
  });

  fields;
  touched;
  errors;

  resetForm("isOld");

  return (
    <form {...props.form}>
      <input style={{ color: "asd" }} id="name" type="text" value={fields.name} onChange={() => {}} />
      <input id="isOld" type="checkbox" checked={fields.isOld} />
      <input id="email" type="text" value={fields.name} />
      <span>{errors.name && touched.name}</span>
    </form>
  );
};
