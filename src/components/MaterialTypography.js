import React from "react";
import { Typography } from "@material-tailwind/react";

const MaterialTypography = ({ children, darkMode = false, light, dark, className = "", ...props }) => {
  // Definir el color basado en el modo oscuro/claro
  const textColor = darkMode ? light :dark;

  return (
    <Typography
      className={`${textColor} ${className}`}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default MaterialTypography;