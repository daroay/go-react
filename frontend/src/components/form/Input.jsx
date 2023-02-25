import { forwardRef } from "react";

const Input = forwardRef(
  (props, ref) => {
    return (
      <div className="mb-3">
        <label htmlFor={props.name} className="form-label">
          {props.title}
        </label>

        <input
          required
          type={props.type}
          className={props.className}
          id={props.name}
          ref={ref}
          name={props.name}
          placeholder={props.placeHolder}
          onChange={props.onChange}
          autoComplete={props.autoComplete}
          value={props.value}
          pattern={props.pattern}
        />
        <div className={props.errorDiv}>{props.errorMessage}</div>
      </div>
    );
  }
);

export default Input;
