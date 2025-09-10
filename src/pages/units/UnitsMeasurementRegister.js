import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../../components/DynamicForm';
import { Typography } from '@material-tailwind/react';
import SweetAlert2 from '../../components/SweetAlert2';
import Breadcrumbs from '../../components/Breadcrumbs';
import PropTypes from "prop-types";

const UnitsMeasurementRegister = ({ darkMode }) => {
    // Agregar validación de props
    UnitsMeasurementRegister.propTypes = {
        darkMode: PropTypes.bool.isRequired, // Especifica que darkMode debe ser booleano y obligatorio
    };

    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token')); // Estado para rastrear el token

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

    // Generar las rutas para el Breadcrumbs
    const breadcrumbsPaths = [
        {
            name: "Home",
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
            name: "Conexiones",
            route: "/connections",
        },
        {
            name: "Unidades de medicion",
            route: "/units-measurement",
        },
        {
            name: "Registro",
            route: "/units-measurement/register",
        },
    ];

    const handleSubmit = async (formData) => {
        try {
            // Asegurarse de que 'profile' sea un array
            const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/measurementunits`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar la unidad de medida');
            }

            await SweetAlert2({
                title: 'Éxito',
                text: 'Unidad de medida registrado correctamente',
                icon: 'success',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });

            navigate('/units-measurement'); // Redirige a la tabla de usuarios
        } catch (error) {
            await SweetAlert2({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const formFields = [
        {
            type: 'text',
            name: 'name',
            label: 'Nombre',
            required: true,
            span: 6,
        },
        {
            type: 'text',
            name: 'volumenUm',
            label: 'Volumen UM',
            required: false,
            span: 6,
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
            span: 4,
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
            label: 'Fecha Inicio Formato',
            required: false,
            span: 6,
        },
        {
            type: 'text',
            name: 'fechaFin',
            label: 'Fecha Fin Formato',
            required: false,
            span: 6,
        },
        {
            type: 'text',
            name: 'fraccionMolarUm',
            label: 'Fraccion Molar UM',
            required: false,
            span: 6,
        },
        {
            type: 'text',
            name: 'poderCalorificoUm',
            label: 'Poder Calorifico UM',
            required: false,
            span: 6,
        },
    ];

    return (
        <div className={`${bgColor} max-h-screen`}>
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

            {/* Título y Subtítulo */}
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Registro de Unidad de medida
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Completa el formulario para registrar una nueva Unidad de medida
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Formulario Dinámico */}
            <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
                <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
                    <DynamicForm fields={formFields} onSubmit={handleSubmit} darkMode={darkMode} />
                </div>

            </div>
        </div>
    );
};

export default UnitsMeasurementRegister;