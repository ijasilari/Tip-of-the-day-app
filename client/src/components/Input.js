import React, { forwardRef } from "react";
import "./Input.css";

const Input = forwardRef((props, ref) => {
  return (
    <div className="form-control">
      <label htmlFor={props.id} className="inputLabel">
        {props.label}
      </label>
      <input
        ref={ref}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        className="Input"
      />
    </div>
  );
});

export default Input;
