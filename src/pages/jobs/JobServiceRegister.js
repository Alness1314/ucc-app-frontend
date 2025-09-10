import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../../components/DynamicForm';
import SweetAlert2 from '../../components/SweetAlert2';
import { Typography, Spinner } from '@material-tailwind/react';
import Breadcrumbs from '../../components/Breadcrumbs';
import apiService from '../../service/ApiService'

// Estado global simulado (puedes usar Context API o Redux en su lugar)
let cachedMeasurementOptions = null;

const JobServiceRegister = ({ darkMode }) => {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token')); // Estado para rastrear el token
    const [measurementOptions, setMeasurementOptions] = useState([]);
    const [groupOptions, setGroupsOptions] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

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
            name: "Servicios",
            route: "/cron-services",
        },
        {
            name: "Registro",
            route: "/cron-services/register",
        },
    ];

    useEffect(() => {
        const fetchMeasurementSystems = async () => {
            // Si los datos ya están en memoria, no hacemos la solicitud
            if (cachedMeasurementOptions) {
                setMeasurementOptions(cachedMeasurementOptions);
                setLoading(false);
                return;
            }
    
            try {
                // Usamos el servicio de Axios para hacer la solicitud
                const response = await apiService.get(
                    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/measurementsystems`,
                    null, // No se necesitan parámetros adicionales
                    true // Indica que la solicitud requiere autenticación
                );
    
                // Mapeamos los datos de la respuesta
                const mappedMeasurement = response.data.map((measurement) => ({
                    value: measurement.id,
                    label: measurement.tag,
                }));
    
                // Almacenamos los datos en memoria
                cachedMeasurementOptions = mappedMeasurement;
                setMeasurementOptions(mappedMeasurement);
            } catch (error) {
                console.error('Error fetching measurementSystems:', error);
            } finally {
                setLoading(false); // Finalizamos la carga
            }
        };
    
        fetchMeasurementSystems();
    }, [token]);

    useEffect(() => {
         // Cargar sistemas de medición
         apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/enums-system/tipos/jobs-groups`)
         .then(response => {
            const mappedGroups = response.data.map((group) => ({
                value: group,
                label: group,
            }));
            setGroupsOptions(mappedGroups)
         })
         .catch(error => console.error('Error fetching measurement systems:', error));
    },[])

    const handleSubmit = async (formData) => {
        try {
            // Asegurarse de que 'profile' sea un array
            const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar el servicio');
            }

            await SweetAlert2({
                title: 'Éxito',
                text: 'Servicio registrado correctamente',
                icon: 'success',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });

            navigate('/cron-services'); // Redirige a la tabla de usuarios
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

    const optionsArray = [
        {
            value: true,
            label: "Si",
        },
        {
            value: false,
            label: "No",
        }
    ]

    const formFields = [
        {
            type: 'text',
            name: 'jobName',
            label: 'Nombre',
            required: true,
            span: 6,
        },
        {
            type: 'dropdown',
            name: 'jobGroup',
            label: 'Grupo',
            required: true,
            span: 6,
            options: groupOptions,
            multiple: false, // Indicar que es un dropdown múltiple
        },
        {
            type: 'text',
            name: 'description',
            label: 'Descripcion',
            required: true,
            span: 12,
        },
        {
            type: 'dropdown',
            name: 'expression',
            label: 'Cron expression',
            required: true,
            span: 4,
            options: optionsArray,
            multiple: false, // Indicar que es un dropdown múltiple
        },
        {
            type: 'text',
            name: 'cronExpression',
            label: 'Expression',
            required: false,
            span: 4,
        },
        {
            type: 'number',
            name: 'repeatTime',
            label: 'Tiempo de repeticion',
            required: false,
            span: 4,
        },
        {
            type: 'text',
            name: 'objectId',
            label: 'Id Objeto',
            required: false,
            span: 4,
        },
        {
            type: 'dropdown',
            name: 'objectIds',
            label: 'Ids Objetos',
            required: false,
            span: 8,
            options: measurementOptions,
            multiple: true, // Indicar que es un dropdown múltiple
        },
        {
            type: 'text',
            name: 'groupOPC',
            label: 'Grupo OPC',
            required: false,
            span: 4,
        },
        {
            type: 'dropdown',
            name: 'modbusIndepent',
            label: 'Modbus independiente',
            required: true,
            span: 4,
            options: optionsArray,
            multiple: false, // Indicar que es un dropdown múltiple
        },
        {
            type: 'dropdown',
            name: 'enabled',
            label: 'Habilitado',
            required: true,
            span: 4,
            options: optionsArray,
            multiple: false, // Indicar que es un dropdown múltiple
        },
    ];

    // Si está cargando, mostramos un mensaje de carga
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner color="indigo" className="h-10 w-10" />
            </div>);
    }

    return (
        <div className={`${bgColor} max-h-screen`}>
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

            {/* Título y Subtítulo */}
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Registro de Servicio
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Completa el formulario para registrar un nuevo cron service
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

export default JobServiceRegister;