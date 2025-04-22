import React from "react";
import { Input } from "@material-tailwind/react";

const MaterialInput = ({ mode = false, size = "lg", type = "text", label, className = "", ...props }) => {
  const color = mode ? "indigo" : "indigo";
  
  return (
    <Input
      color={color}
      size={size}
      type={type}
      label={label}
      className={`w-full placeholder:opacity-100 rounded-md ${className}`}
      {...props}
    />
  );
};

export default MaterialInput;