import React from "react";

const InputComponent = ({
  label,
  name,
  type = "text",
  id,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-3.5 py-2.5 border rounded-md text-sm outline-none transition
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20"
          }`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default InputComponent;
