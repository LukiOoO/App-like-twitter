import React from "react";
import { FormInputProps } from "@/types/porps/props";

const FormInput: React.FC<FormInputProps> = ({
  type,
  id,
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
      />
    </div>
  );
};

export default FormInput;
