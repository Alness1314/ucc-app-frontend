import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { AuthContext } from "../context/AuthContext";
import Breadcrumbs from "../components/Breadcrumbs"; // Importa el componente Breadcrumbs corregido
import PropTypes from 'prop-types';
import apiService from "../service/ApiService";

// Estado global simulado (puedes usar Context API o Redux en su lugar)
let cachedModuleL2Options = null;

const Dashboard = ({ darkMode }) => {

  Dashboard.propTypes = {
    darkMode: PropTypes.bool.isRequired,
  };

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
  const [currentCatalog, setCurrentCatalog] = useState(null);
  const iconRoute = "/icons/";
  const iconExt = ".png";
  const [moduleL2Options, setModuleL2Options] = useState([]);

  const sortedRootModules = (modules) => {
    return modules
      .map((module) => ({
        type: "item",
        label: module.name,
        icon: module.iconName,
        description: module.description,
        path: module.route,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  useEffect(() => {

    const fetchModules = () => {
      // Si los datos ya están en memoria, no hacemos la solicitud
      if (cachedModuleL2Options) {
        setModuleL2Options(cachedModuleL2Options);
        return;
      }

      apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modules/all?profile=${user.idProfile}&level=menu`, null, true)
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            const mappedModules = sortedRootModules(response.data);
            cachedModuleL2Options = mappedModules
            setModuleL2Options(mappedModules);
          }
        })
        .catch(error => console.error('Error fetching profiles:', error))
    }

    fetchModules();
  }, [user]);

  const handleCatalogClick = (catalog) => {
    setCurrentCatalog(catalog);
    navigate(catalog.path); // Usar `catalog.path` en lugar de `catalog.route`
  };

  const handleBackToHome = () => {
    setCurrentCatalog(null);
    navigate("/");
  };

  const getPageTitleAndDescription = () => {
    const currentPath = location.pathname;
    const catalog = moduleL2Options.find(module => module.path === currentPath);
    return {
      title: catalog ? catalog.label : "Catálogos",
      description: catalog ? catalog.description : "Selecciona un módulo para comenzar",
    };
  };

  const { title, description } = getPageTitleAndDescription();

  // Generar las rutas para el Breadcrumbs
  const breadcrumbsPaths = [
    {
      name: "Catálogos",
      route: "/Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    ...(currentCatalog ? [{ name: currentCatalog.label, route: currentCatalog.path }] : []),
  ];

  return (
    <div className="p-0 m-0 h-[calc(100vh-100px)] overflow-hidden overflow-y-auto overflow-x-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

      {/* Header panel */}
      <div className="flex justify-between items-center mb-1 mt-4 mr-4">
        {/* Title */}
        <div>
          <Typography variant="h4" className={`mb-1 ${textColor}`}>
            {title}
          </Typography>
          <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
            {description}
          </Typography>
        </div>
      </div>
      <hr className="my-2 border-gray-800" />

      {currentCatalog ? (
        <Card className={`mt-6 w-96 ${bgColor}`}>
          <CardBody>
            <Typography variant="h2" className="mb-2">
              {currentCatalog.label}
            </Typography>
            <Typography className={`${subTextColor}`}>
              {currentCatalog.description || "Descripción no disponible"}
            </Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <Button onClick={handleBackToHome}>Volver al menú</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          {moduleL2Options.map((catalog) => (
            <Card
              key={catalog.path}
              className={`cursor-pointer hover:shadow-lg transition-shadow ${bgColor}`}
              onClick={() => handleCatalogClick(catalog)}
            >
              <CardBody className="text-center">
                <img
                  src={(catalog.icon ? iconRoute + catalog.icon + iconExt : null) ?? "/icons/NONE.png"}
                  alt={catalog.label}
                  className="mb-4 h-32 w-32 mx-auto"
                />
                <Typography variant="h5" className={`mb-2 ${textColor}`}>
                  {catalog.label}
                </Typography>
                <Typography className={`${subTextColor}`}>
                  {catalog.description || "Descripción no disponible"}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;