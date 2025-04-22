import React from "react";
import { Button } from "@material-tailwind/react";

const MaterialButton = ({ children, mode = false, size = "lg", fullWidth = false, className = "", ...props }) => {
  const color = mode ? "indigo" : "indigo";

  return (
    <Button
      color={color}
      size={size}
      fullWidth={fullWidth}
      className={`${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MaterialButton;