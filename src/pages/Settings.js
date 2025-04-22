import React, { useEffect, useContext, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import { AuthContext } from "../context/AuthContext";
import apiService from "../service/ApiService";
import PropTypes from 'prop-types';

let cachedModuleL3Options = null;

export default function Settings({ darkMode }) {

  Settings.propTypes = {
    darkMode: PropTypes.bool.isRequired,
  };

  const { user } = useContext(AuthContext);
  const [moduleL3Options, setModuleL3Options] = useState([]);
  const [currentCatalog, setCurrentCatalog] = useState(null);
  const navigate = useNavigate();
  const bgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";
  const iconRoute = "/icons/";
  const iconExt = ".png";

  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";

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

  //obtener los modulos desde enpoint
  useEffect(() => {
    const fetchSettingsModules = () => {
      // Si los datos ya están en memoria, no hacemos la solicitud
      if (cachedModuleL3Options) {
        setModuleL3Options(cachedModuleL3Options);
        return;
      }

      apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modules/all?profile=${user.idProfile}&level=settings`, null, true)
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            const mappedModules = sortedRootModules(response.data);
            setModuleL3Options(mappedModules);
          }
        })
        .catch(error => console.error('Error fetching profiles:', error))
    }

    fetchSettingsModules();
  }, [user]);

  const handleCatalogClick = (catalog) => {
    setCurrentCatalog(catalog);
    navigate(catalog.path); // Usar `catalog.path` en lugar de `catalog.route`
  };

  const handleBackToHome = () => {
    setCurrentCatalog(null);
    navigate("/");
  };

  // Generar las rutas para el Breadcrumbs
  const breadcrumbsPaths = [
    {
      name: "Configuración",
      route: "/settings",
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
            Configuración
          </Typography>
          <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
            Administra las configuraciones generales
          </Typography>
        </div>
      </div>

      <hr className="my-2 border-gray-800" />

      {/* Mostrar la tabla con los datos */}
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
          {moduleL3Options.map((catalog) => (
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
}