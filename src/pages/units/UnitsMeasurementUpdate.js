import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import DynamicForm from '../../components/DynamicForm';
import { Typography } from '@material-tailwind/react';
import Breadcrumbs from '../../components/Breadcrumbs';
import apiService from '../../service/ApiService'
import SweetAlert2 from '../../components/SweetAlert2'
import PropTypes from 'prop-types';

export const UnitsMeasurementUpdate = ({ darkMode }) => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null); // Estado para almacenar los datos iniciales del usuario
  const { id } = useParams(); // Obtener el ID del usuario desde la URL

  const bgColor = darkMode ? "bg-gray-900" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
  const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

  // Cargar los datos del usuario cuando el diálogo se abre
  useEffect(() => {
    const fetchUserData = () => {
      apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/measurementunits/${id}`, null, true)
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            setInitialData(response.data)
          }
        })
        .catch(error => {
          console.error(error)
          SweetAlert2({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonColor: "#3bdb39",
            confirmButtonText: 'Aceptar',
          });
        })
    }
    fetchUserData();
  }, [id]);

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
    {
      name: "Unidades de medida",
      route: "/units-measurement",
    },
    {
      name: "Editar",
      route: "/units-measurement/update"
    }
  ];

  const handleSubmit = async (formData) => {
    apiService.put(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/measurementunits/${id}`, JSON.stringify(formData), true)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          SweetAlert2({
            title: 'Éxito',
            text: 'Unidad de medida actualizada con exito.',
            icon: 'success',
            confirmButtonColor: "#3bdb39",
            confirmButtonText: 'Aceptar',
          });

          navigate('/units-measurement'); // Redirige a la tabla de usuarios
        }
      })
      .catch(error => SweetAlert2({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: "#3bdb39",
        confirmButtonText: 'Aceptar',
      }))
  };

  const formFields = [
    {
      type: 'text',
      name: 'name',
      label: 'Nombre',
      required: false,
      span: 12,
    },
    {
      type: 'text',
      name: 'volumenUm',
      label: 'Volumen UM',
      required: false,
      span: 4,
    },
    {
      type: 'text',
      name: 'volumenInicialUm',
      label: 'Volumen Inicial UM',
      required: false,
      span: 4,
    },
    {
      type: 'text',
      name: 'volumenFinalUm',
      label: 'Volumen Final UM',
      required: false,
      span: 4,
    },
    {
      type: 'text',
      name: 'temperaturaUm',
      label: 'Temperatura UM',
      required: false,
      span: 6,
    },
    {
      type: 'text',
      name: 'presionUm',
      label: 'Presion UM',
      required: false,
      span: 6,
    },
    {
      type: 'text',
      name: 'fechaInicio',
      label: 'Formato Fecha Inicio',
      required: false,
      span: 6,
    },
    {
      type: 'text',
      name: 'fechaFin',
      label: 'Formato Fecha Fin',
      required: false,
      span: 6,
    },
    {
      type: 'text',
      name: 'fraccionMolarUm',
      label: 'Fracción Molar UM',
      required: false,
      span: 6,
    },
    {
      type: 'text',
      name: 'poderCalorificoUm',
      label: 'Poder Calorifico UM',
      required: false,
      span: 6,
    }
  ];

  return (
    <div className={`${bgColor} max-h-screen`}>
      {/* Breadcrumbs */}
      <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

      {/* Header panel */}
      <div className="flex justify-between items-center mb-1 mt-4 mr-4">
        {/* Title */}
        <div>
          <Typography variant="h4" className={`mb-1 ${textColor}`}>
           Actualizacion de Unidad de medida
          </Typography>
          <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
            Completa el formulario para actualizar los campos de la unidad de medida
          </Typography>
        </div>

      </div>

      <hr className="my-2 border-gray-800" />

      {/* Formulario Dinámico */}
      <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
        <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
          <DynamicForm fields={formFields} onSubmit={handleSubmit} initialValues={initialData} darkMode={darkMode} />
        </div>

      </div>
    </div>
  );
}

UnitsMeasurementUpdate.propTypes = {
  darkMode: PropTypes.any.isRequired,
};