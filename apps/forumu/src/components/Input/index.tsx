import { FunctionComponent, InputHTMLAttributes, ReactNode } from "react";

interface Input extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  helper?: ReactNode;
  error?: boolean;
  name: string;
}

export const Input: FunctionComponent<Input> = ({ label, name, helper, error, ...restProps }) => {
  return (
    <label htmlFor={name} className="flex flex-col text-slate-900">
      {label}
      <input name={name} id={name} type="text" className="mt-1 px-3 py-2 bg-slate-50 border border-slate-600 rounded-md" {...restProps} />
      {helper && <p className="text-slate-600">{helper}</p>}
    </label>
  );
};
