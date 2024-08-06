import React from "react";

interface InputFieldProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  value,
  onChange,
  label,
  required,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xl font-semibold my-1 whitespace-nowrap"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 text-xl font-semibold text-indigo-600 drop-shadow-md"
        required={required}
        autoComplete={type === "password" ? "on" : undefined}

      />
    </div>
  );
};

export default InputField;
