import React from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs as MuiBreadcrumbs } from "@material-tailwind/react";

const Breadcrumbs = ({ paths, darkmode }) => {
  const navigate = useNavigate();
  const textColor = darkmode ? "text-gray-400" : "text-gray-100";

  return (
    <MuiBreadcrumbs className={`mb-2 bg-gray-100 dark:bg-gray-800`}>
      {paths.map((path, index) => (
        <button
          key={index}
          onClick={() => navigate(path.route)}
          className={`flex items-center text-blue-gray-700 dark:text-blue-gray-200 ${
            index === paths.length - 1 ? "" : "opacity-60"
          }`}
        >
          {path.icon && (
            <span className="mr-2 text-indigo-700 dark:text-indigo-200">
              {path.icon}
            </span>
          )}
          {path.name}
        </button>
      ))}
    </MuiBreadcrumbs>
  );
};

export default React.memo(Breadcrumbs);