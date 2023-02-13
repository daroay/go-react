import { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputField>(
  (props: InputField, ref) => {
    return (
      <div className="mb-3">
        <label htmlFor={props.name} className="form-label">
          {props.title}
        </label>

        <input
          type={props.type}
          className={props.className}
          id={props.name}
          ref={ref}
          name={props.name}
          placeholder={props.placeHolder}
          onChange={props.onChange}
          autoComplete={props.autoComplete}
          value={props.value}
        />
        <div>{props.errorMessage}</div>
      </div>
    );
  }
);

export default Input;
