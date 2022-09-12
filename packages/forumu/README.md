# React Forumu

Simple and powerful form handler for React

## Important

At the moment, this library can only be used as a react hook.

## Sections

- [Installation](#installation)
- [Setup](#setup)

# Installation

Install as package with npm:

`npm install @sutiles/forumu`

# Setup

## Example

```js
import React from "react";
import { useForumu } from "@sutiles/forumu";

export default function Login() {
  const { fields, props } = useForumu({
    initValues: {
      email: "",
      password: "",
    },
    onSubmit: (fields, event) => {
      console.log(fields.email, fields.password, event)
    }
  });

  return (
    <form {...props.form}>
      <input type="text" name="email" id="email" {...props.input} />
      <input type="text" name="password" id="password" {...props.input} />
      <button type="submit">Login</button>
    </form>
  );
}
```

## Settings
| Key | Type | Required | Description |
| --- | --- | --- | ------ |
| initValues | `object` | Yes | Initial values of fields. |
| onSubmit | `function` | Yes | Callback to be called when the form's `submit` is fired. Receives two arguments, `fields` and `event`. |
| onChange | `function` | No | Callback to be called when `change` event is fired. Receives current `event` as argument. |
| validator | `function` | No | Callback to be called when values of `fields` has been changed or when the form's `submit` event is fired. Receives `fields` and `errors` as arguments. |
| filter | `function` | No | Function for input data validation, if it returns false, the fields will not be updated. Receives `entry` and `event` as arguments. |
| preventError | `boolean` | No | Prevent `onSubmit` callback if it contains errors. By default it is set to `true`. |
| discriminate | `boolean` | No | Assigns the value of the fields depending on the type of input. If it is of type checkbox, the assigned value will be `boolean`, if it is text it will be of type `string`. By default it is set to `true`. |

## Values
| Key | Type  | Description |
| ---- | ---- | ------------- |
| fields | `object` | All field values. | 
| touched | `object` | All touched fields. |
| errors | `object` | All errors fields. |
| resetForm | `function`| Reset form fields, receives field keys as parameters. | 
| props | `object` | Contains the respective form and input props. |
