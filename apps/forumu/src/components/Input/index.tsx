import clsx from "clsx";
import { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  helper?: ReactNode;
  name?: string;
  isDangerous?: boolean;
}

const INPUT_CLASSES = {
  normal: "border-slate-600",
  danger: "border-red-600",
};

const HELPER_CLASSES = {
  normal: 'text-slate-600"',
  danger: "text-red-600",
};

export const Input = ({ label, name, helper, isDangerous, ...restProps }: Props) => {
  const _labelClasses = clsx("flex flex-col text-slate-900");
  const _inputClasses = clsx(
    "mt-1 px-3 py-2 bg-slate-50 border  rounded-md focus:outline-violet-600 read-only:outline-0",
    isDangerous ? INPUT_CLASSES.danger : INPUT_CLASSES.normal,
  );
  const _helperClasses = clsx(isDangerous ? HELPER_CLASSES.danger : HELPER_CLASSES.normal);

  return (
    <label htmlFor={name} className={_labelClasses}>
      {label}
      <input name={name} type="text" className={_inputClasses} {...restProps} />
      {helper && <p className={_helperClasses}>{helper}</p>}
    </label>
  );
};
